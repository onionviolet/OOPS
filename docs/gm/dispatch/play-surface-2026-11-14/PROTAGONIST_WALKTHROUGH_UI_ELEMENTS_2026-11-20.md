# UI a protagonist walkthrough needs (2026-11-20)

Status: inventory and proposal (AD32), not an accepted decision. Written for
Weibao's question "What are all the UI elements needed for a protaginist
walktrhough". Status column: **exists** means a file or receipt is in the repo
(not re-played for this note), **in a lane** means one of the three Sol lanes
started 11:01 is building it, **gap** means nobody owns it.

## What he asked for

- "Major considerations and requirements needed to implement a protagonist play through properly, as if they are truly a player, and have their ui and choices and more, have the same treatment as if a player is playing through them, so I believe what we need to do is to adjust how we make or design the ui in the first place?" ([combat chat turn 5](../../../audits/CODEX_CHAT_DRIFT_REVIEW_IMPROVE_COMBAT_UI_2026-11-20.md))
- "mechanisms fist, creating the protaginist's life so its as if they are playing their own life?" (2026-11-02, [log](../../USER_VISION_LOG_2026-11.md#clarification-mechanisms-first-so-the-protagonist-lives-their-own-life-2026-11-02))
- Protagonist lives are the developer build-through for everything they touch (2026-11-03, same log).

The test from [ACTIVITY_UI_REVIEW](ACTIVITY_UI_REVIEW_2026-11-20.md) "Walkthrough acceptance proposal": the player can **discover** an option, **compare** it with a plausible alternative, **commit**, **recognize** the outcome and **act on it later**, through the same commands and cues a player gets. Every element below serves one of those five verbs.

## Elements

| Code | Element | Serves | Status |
|---|---|---|---|
| PW1 | Top band: who, where, when, vitals, the reserve that matters in this world, read from the live owner | discover, recognize | exists (reserve follows the fight, `src/ui/status_line.js`, uncommitted) |
| PW2 | Place panel: what is here, who is here, exits with cost and closure reason | discover | exists for native and Tingen; gap for other worlds (ACTIVITY_UI_REVIEW line 65) |
| PW3 | Action list grouped by what the action does, each with cost, time and blocker beside the control | discover, compare | in a lane for combat (move groups); gap for daily-life actions |
| PW4 | Quote before commit: what the choice will cost and what it can yield, before the click | compare | exists as a pattern (quote and commit paths); per-panel coverage uneven |
| PW5 | Fight surface: one row per fighter with state in place, scene header, intent, downed-person fate choice | all five | in a lane (`combat-page-sol`, includes F16 Bind and the Threat overlap) |
| PW6 | Making surfaces with their own shape: vessel and ordered additions for potions, workpiece and component picker for forge | compare, recognize | in a lane (`potion-bench-sol`, `forge-picker-sol`) |
| PW7 | Inventory that tells the truth about what the character holds | discover | gap: F13 (count above "You carry nothing of your own") |
| PW8 | Knowledge and observation: what the character knows, hidden behind the same rules as any player | discover | exists (`src/known_things.js`, notebook); not checked against a walkthrough |
| PW9 | Event log (Reports) that records what happened while the governing state stays where it matters | recognize | exists |
| PW10 | Lasting consequences visible later: debts, pledges, injuries, reputation, a bound prisoner, a settling dose | act on it later | partial (`src/pledges_ui.js`, conditions); the Tingen dose return is in the potion lane |
| PW11 | People panel: relationships and what each person expects of you | discover, act later | exists in part; not reviewed this pass |
| PW12 | World switching and the world's own panels | discover | gap: F27 (All panels → Other worlds opens empty) |
| PW13 | Time controls: wait, rest, travel time, abstracted stretches as a progress bar | commit, act later | exists for travel; abstraction bar is a proposal (2026-11-03) |
| PW14 | Checkpoint and replay: named save just before a fork, disposable copies, save/reload/export/import | developer proof | exists as AD54 scenarios; coverage per protagonist uneven |
| PW15 | Each world's look: palette, ornaments and colour meaning from its reference picture | identity | rule exists (UR177); applied only where a lane is building |
| PW16 | Runner parity: the headless runner reads the same visible text and presses the same controls | developer proof | exists (Game MCP); limits logged in `docs/tools/GAME_MCP_LIMITS.md` |
| PW17 | Feel layer: tactile press and settle, a small reaction on the subject (pet, strike, swirl), quiet ambient life, the result kept readable after the flourish | identity, recognize | gap in the running lanes; see below |

## The design change he asked about

His turn-5 hunch was right, and the existing proposal says the same thing: design a panel **from a reachable fork in a protagonist's life**, not from a feature list. Write the literal screen text for both branches of one real choice first (ACTIVITY_UI_REVIEW, "One sketch first"), then build the control that fork needs. The three Sol briefs are the first lanes that work this way: his quotes, a reference picture, a reachable save, a before/after gate.

## Ideaboarding that lands (proposal)

- IB1. An idea leaves the board as a brief with four parts: his quoted words, a reference picture, a reachable save just before the fork, and the owned files. Missing any part, it stays on the board.
- IB2. Each brief returns a before/after/side-by-side screenshot of the real game. Concept art is not a result.
- IB3. The board ranks ideas by which PW gap they close, so the board and the build share one list.
- IB4. After a lane lands, the board session reviews the screenshots with him before it opens the next round.

## Subtle detail from the Discord pictures chat (added 2026-11-20)

Source: [visual reference sheet](../../../research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md), built from his turn: "Ui that reflects player action and more like the hearth? Or the climbing thing? So the Ui can be more animated in genera;? Pop ups emoticons on the ui from clickign things? More subtle detail like those?" None of the three Sol briefs cites the sheet or mentions animation, tactile clicks, emoticons or ambient motion. Two cards reached a brief by overlap: VR11 (forge brief keeps the selected stack through a re-sort) and part of VR01 (combat brief puts named conditions on the fighter row).

What each running lane misses from the sheet:

| Lane | Cards that apply | What it adds |
|---|---|---|
| Combat page | VR01, VR04, VR05, VR16, VR19 | The observed effect sits on the creature, with its cause revealed by observation; failure shows where it happened; two approaches to one goal with a visible reaction; a press response on moves; the outcome stays readable in the row and Reports after the flourish |
| Potion bench | VR17, VR16, VR19, VR12 | A swirl on stirring and a change on the vessel itself; freshness as an observation rather than a timer |
| Forge picker | VR17, VR10, VR16 | A small strike on the workpiece; break and dismantle quote different outcomes |

The sheet's own first step (VR03, VR14, VR16, VR18, VR19: hearth refuel plus pet and play reactions) is the household slice the Discord chat left interrupted and uncommitted in `src/`. Its fate is still Weibao's call (DPP2 in the [Discord chat review](../../../audits/CODEX_CHAT_DRIFT_REVIEW_DISCORD_PICTURES_2026-11-20.md)).

Shared acceptance from the sheet (VR15, VR16): test mouse, Enter and Space; hold and repeat; no success feedback on a disabled action; focus stays on the action; effects off and reduced motion leave costs and saved results unchanged; ambience never moves a click target; judge whether it feels good, not only whether it reads.

Decision (Weibao, 2026-11-20): "Per-lane second pass". Briefs: [feel pass rules](SOL_FEEL_PASS_COMMON_2026-11-20.md), with potion, then combat, in the main checkout, and forge in its own worktree. The potion pass owns the shared press response in `src/ui/kit.js`.

## The other main surfaces (added 2026-11-20)

Weibao: "Also consider how our main parts, like the harvesting and the combat ui and more? more to consider?" The three Sol lanes cover combat, potions and forge. The surfaces below get no lane yet. All share one shape that the lanes are building: **the subject in the centre, the choice beside it with its quote, the change shown on the subject, the result kept after**.

| Code | Surface | Now (read from code, not replayed) | What the shape adds | Reference |
|---|---|---|---|---|
| MS1 | Harvesting (`src/harvest_ui.js`, "Carcass processing") | A collapsible box with inline styles (`border:1px solid #888`), a paragraph of rules, a checkbox and a routine meter. Bypasses the kit tokens (UR163). | The carcass or plant as the subject, with freshness as an observation (VR12) and its parts as slots; whole versus one-part quoted side by side; the part comes away on the subject (VR17) | Corc's logging clip: target name, toughness and durability in fixed places, felled result (ACTIVITY_UI_REVIEW F15) |
| MS2 | Gathering (`src/gathering_panel.js`, Village verge) | 43 lines, a list view | The patch as the subject, what is left and when it regrows, the tool's identity | Same clip; YAIR stock counts changing in place (DU3) |
| MS3 | Household and hearth | The interrupted Discord-chat slice, uncommitted (DPP2) | Hearth fuel and pet reactions (VR03, VR14, VR16, VR18) | The sheet's own first step |
| MS4 | Place and travel | Native and Tingen walk maps | Services named with travel cost and closure (VR09) | Atlas prototype |
| MS5 | Trade | Staged trade exists | A pending deal, then the committed result, with cancel (VR13) | VR13 |
| MS6 | People | Exists in part | The same individual recognisable across visits, with a local reaction (VR06) | Creature desk prototype |

Ranked by how often a protagonist touches them: MS1 and MS2 come first (Fang Yuan hunts, Village and Hogwarts gather), then MS4, MS3, MS5, MS6. Proposal: one Sol lane for MS1 and MS2 together after the queued lanes, since harvesting and gathering share the subject-and-depletion shape.

More to consider:
- **One skeleton, many subjects.** If forge, potion, combat and harvest each get their own layout from scratch, the game looks like four games. Fix the skeleton (subject, quote, change, result) and let the subject carry the identity.
- **Long work.** Harvest routines run many cycles. YAIR shows a long task with its rate and a Finish control (DU32). The routine meter should read the same way across harvest, brewing batches and forge repeats.
- **The protagonist's own reason.** A walkthrough is played for a reason in that life (Fang Yuan hunts to feed Gu). The surface can say what the result is for when the game knows it, through the PW10 consequence line.

## Making combat look harmonious (added 2026-11-20)

Weibao: "How to make our combat ui look more harmonious and well coordinated?"

The earlier harmony round already did the base work and it is on master (`mock/fight-form-2026-11-19` merged, [UI_HARMONY_REVIEW round 7](../../../audits/UI_HARMONY_REVIEW_2026-11-19.md)): opponent stats use the Hero panel's words, opponent bars use the Hero bar's tokens, buttons are one size, and yellow marks your own choices. Harmony comes from shared parts. Identity comes from arrangement and the subject.

| Code | Move | Rule |
|---|---|---|
| CH1 | Keep one bar form for every pool and fighter (YAIR's, number inside), from the shared tokens | UR166 |
| CH2 | Keep YAIR's Opponent box as the base form, with approach set before the fight and folded to one line | UR167 |
| CH3 | Tell move groups apart by heading, order, spacing and a semantic token colour (harm, hinder, protect, influence, escape), keeping one button size and shape | UR166, round 7 F15 |
| CH4 | One semantic colour map for the whole game, sampled from the reference pictures: state, item, place, person, time. Combat uses the same orange for a state as the potion bench does | UR177 |
| CH5 | Review the fight beside a neighbouring box at 1920×1080 with the real font, and name every difference | UR176 |
| CH6 | One focal point per beat: the opponent row that changed. Everything else holds still (VR18 stable targets) | UR165, UR176 craft pass |

Risk in the running combat lane: its brief says "make the groups look visibly different" and gives it a new `styles/combat_page.css`. Read literally, that could bring new button styles and sizes and undo round 7. CH3 is the reading that keeps both. The coordinator should check the combat lane's side-by-side for this before committing.

## Harvesting and mining: scene bar or individual nodes? (added 2026-11-20)

Weibao: "consider standard harvesting and mining and more? Where its just a progress bar for the entire scene? or should we make it for individual trees or rocks and stuff? mroe to consider?"

What exists (search, not replayed): stock is kept per place and source (`src/craft_sources.js:114`, a `nodeKey` that already carries an `instanceId`), with regrowth; the Village gathering view shows one stock bar per site; the workshop seam is a held entity with its own stock. No tree or rock has its own identity yet. Standing direction: repeated work is abstracted (2026-11-03), some systems stay simple (2026-11-08, XC25), and [ACR13](../../../ACTIVITY_ABSTRACTION_RULES.md) already says pools may stand in for unneeded detail while "meaningful individuals" keep their identity.

| Code | Option | Gains | Costs |
|---|---|---|---|
| GO1 | One progress bar for the whole scene | Cheapest, fits idle play and ACR1 | Every wood looks the same; nothing to choose |
| GO2 | Every tree and rock is its own node with durability (Corc's logging clip) | Strong identity, a real target | Grindy at scale, a large save, many clicks |
| GO3 | **Hybrid (recommended):** the site keeps a pooled common stock worked by one bar, plus a few named nodes that differ in a way that matters (the old oak, a copper vein, a hornet-guarded hive) | Choice where it matters, compression elsewhere; ACR13 already allows it; `instanceId` already exists in the key | Needs a rule for what earns a name |
| GO4 | **Unusual:** the landscape is the bar. The clearing widens, the quarry face recedes, the berry bushes go bare, drawn on the place view | Progress you can see in the world, and ambient life (VR18) | Art per site; works best layered on GO3 |

Recommendation: GO3 with GO4's idea on the place view where art exists. A node earns a name when it differs in quality, danger, ownership, lore or tool need. Work the commons with one bar and a stop target (the harvest routine already does this); step into a named node for the Corc treatment (name, toughness, remaining durability, the felled or broken result).

More to consider:
- **Mining is different from logging.** A vein continues into the rock and can run out or branch; a face can collapse (VR04 failure at the point it happened); tools wear and pick quality changes yield (the seam already reads grade from the tool).
- **Foraging is about knowing.** What a plant is and when it is ripe is observation and season, not durability (VR12).
- **Ownership and law.** A tree in a lord's wood or a vein in a Gu Master clan's mountain carries a consequence; the named node is where that shows.
- **Grind.** XC24 (a grind spot in every world with fading returns) fits the commons bar, not the named nodes.
- **Danger on site.** A wolf at the woodline turns a harvest into a fight; the scene header from combat can be the same header.

## Combat that shows every possibility, many enemies and the environment (added 2026-11-20)

Weibao: "How can our combat ui show all of our possibilities in a cohesive way and more? How to allow for mutiple enemies and more? account for the enviorment? more to consider?"

What exists (search, not replayed): a fixed-slot opponent board with letters and groups left (`src/opponent_board.js`); targeting of the wanted or weakest foe (`src/tempo_fight.js:204`); covering allies and ally orders (`src/tempo_allies.js`); fight conditions of light, footing, weather and visibility that change mishap and back-out odds (`src/tempo_fight.js:181-186, 544, 645`); terms Finish, Spare, Take alive, Ask, with capture means (`src/fight_terms.js`); Back away, Yield, Spare, Bind and Take their things. Missing: talk or intimidate as fight moves, cover and terrain in attack resolution, and the pack route (G1). UR36 already says multiple opponents need explicit selection.

**One layout that holds every possibility** (each part already has an owner):

| Code | Part | Holds |
|---|---|---|
| CB1 | Scene header | Place, light, footing, weather, who is watching. Each fact names the move it changes ("Poor footing: lunges risk a slip"), per UR175 |
| CB2 | Two sides | You and allies on one side, opponents on the other, one row per fighter, in YAIR's box (UR167) |
| CB3 | Group rows | A pack shows as one row (count, leader, morale) that opens into individuals when one is targeted, hurt or different |
| CB4 | Target line | The selected target stays selected while the next actor changes (UR36); threats aimed at you mark the row they come from |
| CB5 | Moves by effect | Harm, hinder, protect, influence, escape, each with cost, beats and blocker |
| CB6 | Terms | Finish, spare, take alive, ask, set before the fight, folded to one line, changeable mid-fight |
| CB7 | Timeline | Who acts next, as a strip across the top of the rows |

**Unusual option (EC1):** the environment as a row. A spreading fire, rising water, a collapsing roof or a crowd gathering takes a row on the opponents' side with its own bar and timer, in the same bar form (CH1). You can act on it (put it out, use it, flee it), and it acts on its own beat. This shows the environment without a new widget.

Gaps to fill for "all our possibilities": talk and intimidate as influence moves (none found), terrain you can use (hold a doorway, climb out of reach, cover), and a morale break when a pack's leader falls.

More to consider:
- **Positions without a grid.** Near, far and out of reach as row tags keep it text-first and let ranged and reach weapons mean something.
- **Hidden information.** Opponent facts stay behind the observer rules, so a pack's numbers can read "at least five".
- **Long fights.** Fight on (Auto) exists; a pack hunt may want an encounter policy (ACR1), with the fight stopping at a material moment.
- **Same frame for hunting and harvest.** The scene header and named-node rows are the same idea as GO3, so a wolf at the woodline enters the harvest scene without a screen change.

## Too much detail? Do effect groups help? (added 2026-11-20)

Weibao: "For combat are we showing too much details and more? Showing too much details or details not being cool/might risk bad formatting? Would moves grouped by effect make things harder to parse?"

View: yes on both risks. CB1 to CB7 lists everything the fight can hold, not everything the screen shows at once. His first complaint was a formatting failure (the Threat row overlapping "Who acts next"), and every extra line on a 1920 fight card is another chance of that. [UR167](../../../UI_RULES.md) already answers most of it: a short move row, move words in tooltips, approach set before and folded to one line.

**Density rule (DN, proposal).** On the card, show only what changes the next click: HP and timing bars, named conditions, the selected target, and each move's name with its cost or blocker. Everything else (scene facts, odds, terms, cause of an effect) sits one hover or one fold away, and surfaces on the card only at the moment it decides something ("Poor footing" appears beside a lunge when you hover it, and in the header once when the fight starts).

**Effect groups (proposal: off by default).**

| | One short row, stable order | Groups with headings |
|---|---|---|
| 4 to 7 moves (most fights) | Faster: the eye learns positions, no headings to read | Slower: headings and gaps add lines, moves spread out |
| 8+ moves (Fang Yuan with many Gu, Klein later) | Gets long and hard to scan | Helps, because you look in one group |
| Moves that appear and vanish | Positions shift less | A group can empty and the layout jumps |

So: one short row by default, with each move's effect shown as a thin coloured edge from the shared tokens (harm, hinder, protect, influence, escape) instead of a heading. Groups switch on when the row would exceed about seven moves, as a dial. Positions stay fixed within a fight: a move that becomes unusable stays in place, greyed with its blocker.

This conflicts with the running combat lane's brief, which asks for visible groups. Changing that is Weibao's call; if he agrees, the combat feel pass carries the change.

## Show, discover, bars, loadouts (added 2026-11-20)

Weibao: "maybe it doesnt show and we need to realize it ourselves? or show whats needed? Consider how combat looks in yair and proto23, consider looking at other stuff worth being inspired by>? WHy groups switch only past 7 moves? more to consider? The opponent bar should look more like the thick bars? How to balance future abilities, consumables, other things and more? Delegate consumables into inventory?"

**What the references do (looked at the pictures).** YAIR's cave fight ([ref](../../../../prototypes/yair-columns-2026-11-15/), `yair-cave-encounter.webp` in the combat lane refs): place name with two tags ("narrow", "dark"), then one block per wolf rat: name, one thin stat line, a thick full-width red HP bar with "29/29 hp" inside, a purple timer bar under it. Six identical rows read at a glance. Proto23 (`proto23-combat-1800-14.png`): an opponent box with name, level, a gradient HP bar with the number inside and one stat line; a location box says "You are fighting training dummies"; everything else goes to the message log. Neither puts prose on the fight card.

**What the combat lane built (11:25, `mid-fight.png`).** A scene header, fighter rows, an intent line, nine moves in four bordered boxes (Harm, Protect, Influence, Escape), and a preview box. Fighter HP is a thin underline, while the Hero panel beside it has a thick bar, so the two disagree (UR166). The wolf row runs prose together: "Atk ~2.6 looks stronger than you It fights to eat, and runs when it is hurt enough." The four boxes take more space than the moves.

| Code | Question | View |
|---|---|---|
| SD1 | Show it or let the player realize it? | A ladder per fact: unknown, then felt (the first slip on poor footing happens with no warning, and Reports says why), then named (from then on, "Poor footing" is in the header), then measured (with skill or a study, the risk shows on the move). Fits the observation rules and lets the card start sparse. Opponent facts already work this way ("? Not sized up"). |
| SD2 | Thick bars? | Yes. UR166 already says one bar, YAIR's, number inside. Fighter rows get the same thick bar as the Hero panel, with a thin timer bar under it. Prose about the opponent moves to a hover or the Look line. |
| SD3 | Why seven? | It was a guess, not a measured limit. A better trigger is when the moves stop fitting on one row at the card width, or a player setting. |
| SD4 | Groups by what? | By where the move comes from: Body and weapon, Powers (Gu, Beyonder abilities, spells), Items. Players look for "what do I have", and this split also handles future growth. The effect shows as a coloured edge on each button, without boxes. |
| SD5 | Future abilities | A prepared set: the powers ready for this fight, chosen before it (Darkest Dungeon shows 4 of 7; Klein prepares charms; Fang Yuan's active Gu are limited by essence). The rest sit under "More". The lore supplies the limit, so balance comes from preparation and cost rather than a hard slot count. |
| SD6 | Consumables into inventory? | Mostly yes. The fight card shows a small belt of what is within reach (two to four items you carry ready). Using anything else from the pack costs extra beats. An idle rule such as "eat at a third of health" lives in the fight policy (ACR1). Melvor Idle's food slot with auto-eat is the closest precedent. |

Other games worth a look (from general knowledge, not checked for this note): Slay the Spire and Into the Breach show the enemy's next action ("intent"), which is the cleanest way to show what is needed; Darkest Dungeon for a small skill set and rank positions; Caves of Qud for a text-first ability bar with cooldowns and tooltips; Kingdom of Loathing for a combat item picker; Melvor Idle for thick bars, attack timers and auto-eat.

Proposed change for the combat feel pass, pending Weibao's yes: thick bars on fighter rows (SD2); source rows instead of effect boxes, with coloured edges (SD4); the belt (SD6); opponent prose off the card (SD1).

## Powers, other aspects and the realism dial (discussion, 2026-11-20)

Weibao on PO1-PO5 and RL1-RL4: "I like these, save" (logged 2026-11-20). Still proposals until a slice builds them.

Weibao: "consider how to add powers and more? Other aspects? TOo much realism can be bad too, so something to consider". Proposals for discussion, nothing briefed.

| Code | Idea |
|---|---|
| PO1 | Every power shows one of UR175's states on its button: ready, missing, exhausted, suppressed, expired, out of scope. Moonblade "hungry" is "suppressed" with its reason. |
| PO2 | Three shapes of power: an action (a button in the Powers row), a toggle (Spirit Vision, a stance: a switch in the header that stays on and drains), a passive (no button; it shows in the result it changed, "Copper skin turned 2 of it"). |
| PO3 | Perception powers add information instead of a button: a row, a revealed intent, a "?" that becomes a number. |
| PO4 | Combinations (several Gu together, a ritual) are one prepared button with its full cost, built outside the fight. |
| PO5 | Opponent powers telegraph like Slay the Spire's intent: "Gathering lightning, 2 beats", so a counter exists before the hit. |
| RL1 | Realism lives in the rules, not in the clicks. A realistic rule stays visible if it makes a choice or a story; otherwise it runs underneath. |
| RL2 | By default the first lesson is survivable: the "felt" step of the discover ladder (SD1) is a slip or a scare, not a death. |
| RL3 | Lore fixes the numbers (AD49); presentation can still abstract. A fight can match canon damage and still show one bar. |
| RL4 | Fiddly realism goes behind a dial: per-item reach and beat costs default on for lives where it matters and off where it would only slow play. |

## Power shapes, round 2 (discussion, 2026-11-20)

Weibao: "lets consider power shapes first, more to consider?" PO2 named three shapes (action, toggle, passive). More shapes the lore and code already need:

| Code | Shape | Example | How it shows |
|---|---|---|---|
| PS1 | Action | Moonblade, a Beyonder strike | Button in the Powers row with cost, beats, state (PO1) |
| PS2 | Toggle | Spirit Vision, a stance, a Gu kept active | Header switch that stays lit and drains per beat; the drain shows on the reserve bar |
| PS3 | Passive | Copper skin, a bloodline | No button; a short note in the result it changed |
| PS4 | Channel | A multi-beat cast. Giant Hand already has prepare and finish steps in the Gu keeper practice (`src/gu_keeper_giant_hand.js`); tempo fights have no interrupt yet | Button fills over its beats on your row; with CN1, a hit can break it |
| PS5 | Armed reaction | A parry, a counter, a ward | Set ahead ("If it lunges: Brace"), shown as a small armed mark on your row; fires once on its trigger |
| PS6 | Summon or deploy | Calling a Gu out, a spirit, a construct | Creates a row on your side with its own bar and a duration (ends as "expired", PO1) |
| PS7 | Area | Lightning over a pack | Targets a group row (CB3) and shows the spread in the preview |
| PS8 | Ritual or combination | Several Gu, a prepared rite | One prepared button with its full cost (PO4), built outside the fight |

More to consider:
- **One form in and out of fights.** The Powers row is the same control on the walk and in the fight; out of a fight, a strike is simply unavailable with its reason.
- **Costs of different kinds.** Essence, spirituality, stamina, and risks such as loss of control (LOTM) or being noticed. A risk shows as a meter or chance on the button, not as prose.
- **Reserves versus cooldowns.** Most of our lore uses reserves (essence, spirituality), which the top band and the bar already show; a cooldown is the exception.
- **Powers as creatures.** A Gu is both a power and a living thing that needs feeding. In the fight it is a Powers button; its hunger is the button's "suppressed" state; its care lives in the creature view.

## Allies, summons and creatures (discussion, 2026-11-20)

Weibao: "What about visualizing allies in the future? Such a system would work for summons and creatures and more in the future? Do we put the two panels side by syde and give ourseleves collumns? BUt then wont that duplicate the hp view and more? How to see their Hp and more?"

What exists: allies fight, cover you and hear orders by chance (`src/tempo_allies.js`: Cover me, Take the same foe, Fall back; fear and noise lower the chance); `src/combat_situation_ui.js` lists bystanders "With you". YAIR keeps the Hero box at upper left and the fight in the centre.

| Code | Option | Duplication | Verdict |
|---|---|---|---|
| AL1 | Two columns inside the fight card: your side left, opponents right | Your HP shows twice (Hero panel and fight card) | Breaks "draw a thing once" (UR158) |
| AL2 | The Hero panel becomes the party panel during a fight: you, then allies, summons and creatures as compact rows under the Hero box. The fight card holds the scene, opponents and moves | None: your bar stays in one place | **Recommended.** Matches YAIR's layout, so your side is the left column and the enemies the centre without new columns |
| AL3 | Allies shown in the timeline alone, with a state word and no bars | None | Too thin once a summon or a pet matters |
| AL4 | Unusual: allies show as their next action ("Moss will pounce, 2 beats") instead of a bar, bars on hover | None | Good for many small summons; keep as a Look option |

Recommended row for anything on your side (person, Gu, pet, summon): name, thick HP bar (one form, CH1), thin timer bar, state word (Standing, Shaken, Bound, Fled), and an order chip that shows whether the last order was heard. A swarm or many summons collapses into a group row (CB3) with count and morale.

More to consider:
- **What you know of an ally's health.** A stranger's wounds may be a word ("bleeding"); a bonded creature or a close friend shows the bar. Same observer rules as opponents.
- **Out of fights.** The same party rows show companions on the walk, with hunger, mood and orders; the fight adds timers to them.
- **Space.** The left column already holds the Hero box and inventory. During a fight the party rows push the inventory down; past three or four rows they collapse to a group row.
- **Opponents' summons.** They appear on the opponents' side with the same row form, so a summoner's power reads the same from both sides.

## Channels, beats and a pass for other surfaces (discussion, 2026-11-20)

Weibao: "Channel that has a chance to be broken by enemy attacks? ways to prevent it> other aspects? Powers in daily life? ... Should we move things around? how does your chronicals handle it?" and "how well do beats even tranfer into gameplay? can we abstract that into attack speed or something?" and "How can we do a similar level pass for other Ui elements?"

Code facts: a tempo move costs time units (about seconds), scaled by the fighter's speed (`scaled` in `src/tempo_fight.js`); the earliest-ready fighter acts, and the fight waits for the player with no clock. Tempo fights have no interrupt today. `channelNotice` in the same file is about whether an observer sees a concealed effect, not a cast being broken.

### Breaking a channel

| Code | Idea | How it shows |
|---|---|---|
| CN1 | A hit that lands while you channel breaks it by a keyed chance, scaled by the hit's share of your health | The chance sits on your row as a number ("a hit now breaks it 40%"), beside the filling channel bar |
| CN2 | A broken channel costs something: the spent reserve, a share of it, or backlash. LOTM's lore gives loss-of-control risk; a Gu cast loses its essence | The quote before you start names what a break costs |
| CN3 | Protection: Brace or a ward lowers the break chance; an ally on Cover takes the blow (cover chance already exists in `src/tempo_allies.js`); concentration practice lowers it over time | Each protection shows as a reason under the chance, so the player sees why it dropped |
| CN4 | Shape choices: a quick weak version and a slow strong one; or prepare before the fight (PS8) and spend one beat to release | Two buttons in the Powers row, with costs in their quotes |
| CN5 | Opponents channel too. Their channel bar fills on their row, so the player can choose to strike to break it | Same bar form on the opponent row, which gives a real reason to read their timers |

CN5 is the part that makes channels worth having: it turns the timer bars into decisions on both sides.

### Powers in daily life

- **The same Powers row on the walk (PS1 to PS8 hold out of fights).** Divination before picking a road, a light charm in the dark (light already changes mishap odds), a Gu that speeds a harvest, spirit vision on a stranger.
- **Reserve is shared.** Spending spirituality or essence on chores leaves less for a fight later that day. That is a real choice without a new rule.
- **Being seen.** Concealment and perception already decide who notices an effect. Using a power in Hogwarts corridors or Tingen streets can be witnessed, which matters for secrecy.
- **Toggles drain over time.** A held ward costs while it runs, so leaving it on all day reads on the reserve bar.
- **Practice.** Daily use is how a power gets steadier, which feeds CN3.

### Moving things around

- The channel bar and the break chance sit on your row in the party panel (AL2), not inside the move rows. The move rows say what you can start; the rows on each side say what is happening.
- Outside fights the Powers row moves into the Hero or party panel, reached from where you stand, so daily-life powers sit beside the reserve they spend.

### How Your Chronicle and others handle it

From our own research notes (`docs/RESEARCH_LITRPG_SYSTEMS.md`, from the developer's Steam listing): Your Chronicle advertises automated dungeon battles, offline bonus, and summons with their own skills and equipment. Its exact handling of cast times and interrupts was not found (a web search on 2026-11-20 gave nothing reliable), so treat any claim about it as unverified. Known reference shapes from other genres, as inspiration only: MMO cast bars that a hit or silence can break, with a "pushback" that delays instead of cancelling; turn-based games that show the next actor order; YAIR's own attack timer bars. Pushback is a milder CN1 worth testing: a hit pushes the bar back instead of breaking it.

### Beats as gameplay

Beats already are attack speed: cost divided by speed, and whoever is ready first acts. The question is how to show it.

| Code | Option | Trade |
|---|---|---|
| BT1 | Show beat numbers on every button (now) | Exact, but reads like bookkeeping |
| BT2 | Timer bars, plus a length mark on each button (short, medium, long) and the number on hover | YAIR's feel. The player sees who acts next by the bars. Recommended, because it keeps the per-move trade without the bookkeeping |
| BT3 | Replace beats with an attacks-per-minute speed stat | Loses the per-move trade (quick strike versus heavy swing), which is the point of tempo fights |
| BT4 | In automated or idle fights the beats collapse into speed and a result, with the timeline on hover | Fits auto-dungeons and away time |

Recommended: BT2 in played fights and BT4 in automated ones. Speed stays a stat; beats stay the hidden unit; a channel is just a long bar.

### A level pass for other surfaces

The feel passes used one method: name the reference cards, the harmony rules and the acceptance list, then run one lane per surface and review it beside a neighbour (UR176) against its reference picture (UR177). The same method works for any surface.

| Code | Step |
|---|---|
| LP1 | Pick the surface and its reference picture or clip. Without one, the pass waits for one |
| LP2 | Check it against a fixed list: one bar form (UR166), one button size and fixed places, rows by source (SD4), observation before stat (SD1), the result outlasts the motion (VR19), the shared press response (VR16), density by grouping (DN) |
| LP3 | Write one brief per surface from a shared template, quoting Weibao's words for that surface |
| LP4 | One writer per file set. The order follows how often a protagonist touches it |
| LP5 | Done is a played sequence with step shots, a side-by-side against the reference, and the shared acceptance list |

Order proposal: harvest and gathering (MS1, MS2), the party panel (AL2), the inventory and item belt (SD6), the walk and nearby view, Reports and Journal, then home. Each waits until the lane before it on shared files is committed.

### More to consider on channels, beats and passes (2026-11-20)

| Code | Disposition | Point | Evidence or check |
|---|---|---|---|
| MC1 | Account for now | The break chance as an exact number conflicts with SD1 (observation before stat). Default: a word ("a hard hit would break it") until the hero has practised the power or been broken a few times, then the number | SD1 in this note; settle in the combat feel review |
| MC2 | Account for now | Draws are keyed (LSD139), so reloading mid-channel gives the same break. Good for fairness; the UI need not hint that a reload helps | `src/tempo_fight.js` header comment |
| MC3 | Account for now | A channel in progress has to survive save and reload, since a fight can be held for up to a week of away time. That adds a field to the saved fight, so it needs a migration or an explicit compatibility call (old saves are disposable) | `heldCapMinutes` dial; `src/tempo_fight_contract.js` validates saved fights |
| MC4 | Account for now | Auto hand-over picks safe moves alone (LSD316). Decide whether a channel counts as safe; default is no, so auto fights never start one | `TEMPO_MOVES` `safe` flags |
| MC5 | Later | Daily-life powers cost time in the day as well as reserve. `src/cast_schedule.js` and `src/npc_schedule.js` already plan days, so a power can take a slot instead of a new clock | Read those owners before briefing |
| MC6 | Later | Other people use powers in daily life too: a Beyonder neighbour, a Gu master hunting. The party and opponent rows show their effects by the same observer rules, so the world feels inhabited | Ties to AL rows |
| MC7 | Account for now | Balance guard: a power that speeds harvesting can make gathering trivial. The shared reserve (and the chance of being seen) is the brake; add no new cap unless play shows it is needed | MS1, MS2 lane |
| MC8 | Account for now | BT2 length marks need a shape or count as well as colour, for colour-blind reading, and reduced motion leaves bars stepping instead of sliding | VR15, VR16 acceptance |
| MC9 | Account for now | LP1 waits for a reference picture. Default source when none is supplied: the Discord reference sheet or YAIR's own screen for that surface, named in the brief | UR177 |
| MC10 | Later | After three surface passes, one cross-surface review: the passes look right alone but can drift from each other. Same method as harmony round 7 | UR176 |

## Arkivia changelog: what to take (discussion, 2026-11-20)

Weibao: "consider ui stuff and more from 'https://just-pointless.github.io/arkivia/changelog.html'". Arkivia is a browser text RPG on ticks, with an in-game clock, energy, weather, scenes, skills, crafting, an arena and gathering (mining and felling from v0.24). The changelog has versions (v0.1 to v0.26.1) but no dates, and gives few reasons. Read through a fetch on 2026-11-20; the page hides some text behind spoilers, so the read may be incomplete.

| Code | Arkivia (version) | For us | Disposition |
|---|---|---|---|
| AK1 | Health bars show a damage effect (v0.19) | `heroDamageTrail` in `src/combat_situation_ui.js` already trails the hero's bar. Give every fighter row the same trail, since one bar form (UR166) means one behaviour too. Pairs with VR04's hit mark | Combat feel pass, after MO6 |
| AK2 | Stat and training modifier breakdowns (v0.21) | A hover on a number lists its known causes, the same as CN3's reasons under a break chance. Unknown causes stay an open line ("something else is helping"), per SD1 | Account for now in every surface pass |
| AK3 | Plus sign on positive modifiers; per-second, not per-minute, "to avoid confusion"; multipliers shown as ×1.2, not a percentage (v0.20, v0.26) | One number-format rule across the game: signed changes, one time unit per surface, multipliers as ×. Candidate UI rule | Propose as a UR, then LP2 checks it |
| AK4 | Stats in the browser tab title when the tab is out of focus (v0.20) | Idle fit: "Fang Yuan · resting · 6 essence" or "Fight waiting" in the tab title, so an away player knows without switching | Small lane later; one owner for `document.title` |
| AK5 | Bulk inventory actions, an obvious delete mode, important items cannot be deleted (v0.25, v0.26) | Our inventory and the item belt (SD6). Story and bound items get a lock; delete mode tints the whole panel | Inventory pass in the LP order |
| AK6 | Settings highlight changed options (v0.23) | Cheap and honest: a changed setting shows a mark and a reset | Later |
| AK7 | Setting to skip walking time (v0.26.1) | Our travel takes game time. A skip that still spends the time but not the player's attention fits the idle frame; a skip that removes the time would not | Discuss before building |
| AK8 | Item durability bars (v0.10) | Gear and forge: durability as the same thin bar under the item, not a number | Forge feel pass or inventory pass |
| AK9 | Animation for a task in progress (v0.24) | Same as VR17: the work shows on the subject | Already covered |
| AK10 | Enemy stat total shown (v0.23) | Conflicts with SD1 and the sense words in `src/tempo_fight.js` ("faster than you"). Keep words | Rejected |
| AK11 | Speed decides who acts first (v0.26) | Already true in tempo fights (`byTurn`) | No change |
| AK12 | Repeated item-movement logs stack (v0.18) | Reports and the fight log: repeated lines fold into one with a count ("Took a herb ×3") instead of filling the tail | Reports pass in the LP order |
| AK13 | Weak effects drop off: poison ends below 0.5 damage a tick (v0.26) | Effect rows shed negligible effects instead of keeping a crowded row, which helps the density rule | Account for now in effect rows |
| AK14 | Crafting can repeat automatically and slows at low energy (v0.22, v0.24) | We have routines. Showing tiredness as slower work, not a lockout, matches the realism dial | Later, with routines |
| AK15 | Save corruption checks and backup saves (v0.25) | Save architecture already has backup and undo work under `src/absorb_p23/save_time_options/`. Check it before proposing anything | Note for save review |

## Proto23 and the bugfix fork: what to pull (discussion, 2026-11-20)

Weibao: "Also from https://23html.github.io/ code and https://github.com/yagdra-nihlahorn/proto23bugfix ... code to pull from?"

**Code itself: no.** Proto23 has no licence notice ([fork audit F1](../../../research/PROTOLIKE_FORKS_AND_SIMILAR_GAMES_2026-10-30.md), [UI absorption F3](../../../research/proto23/UI_SOURCE_ABSORPTION_2026-10-13.md)), so its code is reference for ideas, and we re-implement behaviour in our own owners (the `src/absorb_p23/` pattern). It is also a single 14,000-line HTML file with fixed coordinates; importing it would duplicate our owners. Already audited: the full source, five reader reports and the fork network (2026-10-10 to 2026-10-30).

**The bugfix fork** (4 commits, head read 2026-11-20 via the GitHub compare API) changes two lines in `index.html`:
- On death, satiety kept was `sat × 0.55 × (1 − death skill)`, so a better death skill kept less food. The fork makes it `sat × 0.45 × (1 + death skill)`. Lesson for us: a skill that softens a loss must make the loss smaller. Test the direction as well as the value. Our `src/defeat_domain.js` lessons are worth one such test.
- The "moon bloom bug": an area's size reset on leave to `rand(5)+20`, so leaving and coming back refilled it. The fork sets a negative size, which disables the refill. Our gathering stock regrows by game time (`regenPerDay` in `src/craft_sources.js`), not on leaving, so this exploit does not apply. Keep it that way.

**Proto23 mechanisms that fit the current UI work** (codes from the UI absorption doc):

| Code | Proto23 | Current fit |
|---|---|---|
| PP1 (P3) | Floating money text, a blink on a new item, a short opacity ramp on appear | Press response (VR16) and the item belt: a new item blinks once where it lands, and a gain floats from the spot it came from. Each event shows once and respects reduced motion |
| PP2 (P4) | Tight data rows about 30 px, thin separators, a tall log with its own scroll | The combat fix pass's half-height fighter rows and the party rows (AL2). Breathing room goes between groups, not between rows |
| PP3 (P5) | Unknown recipe parts shown as unknown, requirements coloured met or unmet | The discover ladder (SD1) and AK2's open line: an unknown cause or ingredient shows as an unknown slot, not hidden |
| PP4 (P2) | One colour meaning across inventory, actions, tooltips and log | The same check as AK3's number rule, for colour: one token per meaning, item category kept apart from rarity |

## Item 6: rows by source, leaning B (discussion, 2026-11-20)

Weibao, after a mock of A (one strip ordered by source) and B (separate rows): "seperate by source makes most sense righy? more to consider?" Then "Lock in B" (2026-11-20): B is his decision; RS1 to RS7 are its defaults.

| Code | Point | Default |
|---|---|---|
| RS1 | Height. Three rows sit in the centre card under the opponents, so rows stay half-height (PP2) and the label column stays narrow | About 44 px buttons, 6 px gaps |
| RS2 | An empty source. Harry early has no powers; a hunter may carry no items | Hide an empty row; the Items row shows "nothing ready" when the belt is empty but the pack is not |
| RS3 | Many powers. Fang Yuan can carry many Gu | The row wraps inside itself. Past two lines, the least-used fall behind a "more" button that keeps its place |
| RS4 | Order inside a row | Fixed per character, not per fight, so muscle memory holds; the player can reorder |
| RS5 | Keys | One key range per row (1 to 5 body, Q to T powers, Z to V items), shown on hover |
| RS6 | Same rows out of fights | The Powers row on the walk uses the same order and buttons (PS rules), with strikes greyed and their reason |
| RS7 | Channels and armed reactions | A channel's progress shows on your row in the left panel; its button in the Powers row shows "channelling" and stays in place |

### Correction and other games (2026-11-20)

**RS5 correction.** Keys 1 and 2 already press the decision band's buttons in a fight (PS21, `src/combat_situation_ui.js:249`), and Alt plus a letter is navigation (`src/workspace_navigation.js`). Default instead: body moves on keys 3 to 7 is clumsy, so body moves take A to G, powers Q to T, items Z to V, all scoped to the fight card the way the band's keys are. Settle in the combat feel review.

Weibao: "consider how other game does it too?" From general knowledge of these games, not a fresh source read:

| Game | How it splits moves | For us |
|---|---|---|
| Classic Final Fantasy (ATB) | Top menu Attack, Magic, Item, Defend, Flee; party HP rows along the bottom; timer bars fill to act | B by source, AL2 party rows and BT2 timer bars are the same idea |
| Pokémon | Four moves, then Bag, Switch and Run as separate entries | A hard cap keeps the moves row short; items and escape are their own places |
| Undertale | Fight, Act, Item, Mercy | Act (talk) and Mercy (spare) as top-level sources. We have fight terms (finish, spare, take alive, ask) but no talk moves |
| Kingdom of Loathing | Attack button, a skills dropdown, an item dropdown | A dropdown is the text-game answer to many powers (RS3's "more") |
| Slay the Spire | Hand of cards, plus three potion slots along the top | The item belt (SD6) exactly: few slots, visible all fight |
| Darkest Dungeon | Four skill slots per hero, items from the inventory, a stress meter | Slot caps per hero; stress is CN2's loss-of-control meter |
| Baldur's Gate 3 | One hotbar with sections: common actions, spells, items, toggles | B with sections; toggles sit with their source, not apart |
| Melvor Idle | Auto-attack timer, a food slot, prayers as toggles | BT4 for automated fights; toggles as a passive state, not a button press each time |

**What this adds:**
- **RS8, a Terms row (Weibao: "Add Terms row", 2026-11-20, decided).** Undertale and Pokémon both keep leaving or sparing apart from attacks. A fourth row, Terms, for Back away, Yield, Spare, Take alive and Ask, moved out of Body. It also gives future talk or intimidate moves a home. It shows when the fight's terms allow any of them.
- **RS9, a soft cap per row.** Most of these games show four to six moves at a time. Default: six visible per row, the rest behind "more" (RS3).

### Making the four rows look better (proposals, 2026-11-20)

Weibao: "more to consider? Send accordngly, consider how to make visually better and more". Shown as a mock in chat, not built.

| Code | Proposal | Why |
|---|---|---|
| RV1 | Hovering or focusing a move shows its expected harm as a pale segment on the target's thick bar | The strongest single read in FF and card games: you see what the move does to whom before you commit. Reuses the bar and AK1's trail colour in reverse. Expected harm is shown as observed (a range or a word until learned, per SD1) |
| RV2 | A "Your move · target X" strip above the rows, in accent tint | One line answers whose turn and at whom (UR36 multiple-opponent selection). It sits in a fixed place, so nothing shifts |
| RV3 | Terms row quieter: thin text buttons under a hairline, Yield in the warning tone | Used rarely, so it should not compete with Body and Powers. It stays visible so leaving is a real option (VR04) |
| RV4 | Row labels get one small outline icon each (sword, sparkle, pack, flag) | Lets the eye find a row without reading |
| RV5 | Power costs read against the reserve ("1 of 6 essence") | The cost and what is left in one glance, without looking left |
| RV6 | Unusable moves keep their place, dashed outline, reason in the button | Fixed places, no hidden moves, and the reason where the eye already is |
| RV7 | Key letter in the button's top corner, muted | Learnable, out of the way |
| RV8 | Items get their own violet edge for "consumed" | Separates spending a thing from an effect kind; one meaning per colour (PP4) |

**More to consider:**
- **Height.** Four rows plus the strip is about 220 px. If the centre card overflows at 1280 px, Terms collapses into one "Terms ▾" button first.
- **Readiness.** While opponents' timers run, the rows stay clickable for queuing; the strip says "Wolf acts first" instead of dimming everything.
- **After a press.** The pressed button shows the shared press response (VR16), then the strip names the result for a moment before the next turn ("Heavy swing hit, wolf staggered").
- **Colour count.** Four edge colours plus red HP and the accent strip is the ceiling. New effect kinds reuse these, and their difference goes into words.

### Fitting the proposals to the current card (FT1 to FT8, 2026-11-21)

Weibao: "this looks good but doesnt seem to fit what we have right now". The RV mock was drawn in a generic rounded style. Checked against the fix-pass screenshots (`docs/representations/evidence/combat-page-sol-2026-11-20/fix-pass/after.png` and `pack-1280.png`), the card already has square navy buttons with a coloured top edge and a beats line under the label, a red HP bar carrying a word ("Fresh") instead of a number, a purple timer bar, a "Target" tag on the chosen row, "Your turn · acts next" on the left panel, a full-width Back away row, and a dashed refused move with its reason in yellow italic. These replace RV1 to RV8:

- **FT1. Keep the card's own button.** Body, Powers and Items reuse the existing move button unchanged (square, top edge, beats line). Each row gets a small monospace label on the left in the style of the "Cave depths" header. No new button style, radius or icon (drops RV4).
- **FT2. Terms grows out of the Back away row.** Back away, Yield, Ask them not to kill, Spare and Take alive sit as cells in that full-width row under a hairline, each with its beats on the right. This replaces RV3's new thin buttons.
- **FT3. Drop RV2.** The target is already tagged on its row and the turn is already on the left panel. A second strip would draw the same thing twice (UR158).
- **FT4. Harm preview on the word bar (RV1, adapted).** Hovering or focusing a move stripes the end of the target's red fill, and the bar's word shows the likely result ("Fresh → likely Hurt"). It switches to a number once the hero has learned it (SD1).
- **FT5. Costs against what you have go in the existing beats line:** "5 beats · 2 of 29 stamina", "2 beats · 1 of 6 essence" (RV5).
- **FT6. RV6 is already built.** "Ask them not to kill" is dashed with its reason in place. Keep it and move it into Terms.
- **FT7. Key letters (RV7)** go small and grey in the button's top-left corner, matching the Keys tab.
- **FT8. Items do not use violet.** The timer bar is magenta-purple, so violet item edges would read as timing. Items take the amber edge; RV8 is dropped.

**More to consider:**
- **Height is not the constraint.** At 1920 and 1280 the centre column has about 450 px empty under the card. The squeeze is the roster, which scrolls at six rats. Letting the roster grow into the empty space before it scrolls is a better use than collapsing Terms. Decided as FT9 (Weibao: "Yes, add it", 2026-11-21): size it at fight open to the opponents present and the space that fits, then hold that height all fight so the buttons stay put.
- **The repeated stat line.** Five rats in a row all read "Atk ~1 · Spd slower than you · Hit ? Ddg ? Def ?". Identical observations could show once for the group, leaving room on each row for the MC1 state word. Proposal.
- **Dead row font.** The dead "Wolf rat G" switches to a bold monospace yellow that no other row uses. A small harmony fix for the feel pass (CH1 to CH6).

### Avoiding scroll: fold the pack (ST1 to ST9, 2026-11-21; B decided: "Send it, for ui stuff")

Weibao: "How to prevent scroll in the first place? ... stacking enemies into one collumn? So like Hp bars and damage stacked?" Locations spawn groups of up to 8 (`enemy_group_size` reaches [6,8] and [8,8]), nearly always one species. Each row is a full thick-bar row today, which is why six fill the roster. The classic answer (Final Fantasy's and Dragon Quest's "Goblin ×3" lists) is to group identical foes.

- **ST1. Option A, one group row with stacked thin bars.** One stat line, one thin bar per rat with its letter and word. About 130 px for eight. Costs a second bar form (against UR166) and five words to scan.
- **ST2. Option B, fold the untouched (recommended).** Rats you can't tell apart share one row: "Wolf rat ×3 (D–F)", one thick bar reading "All fresh", and one timer with a tick per rat. A rat splits into its own full row once it differs: hurt, targeted, under an effect, yielding or fleeing, or showing a different observation (C's "Atk looks weaker"). This keeps one bar form and fits SD1: untouched rats look the same to the hero, so the screen shouldn't pretend to tell them apart.
- **ST3. Split, don't re-fold.** A split happens as the result of your own move, so the change is expected. Rows re-folding mid-fight would shuffle under the cursor. FT9's fixed roster height still keeps the move buttons in place.
- **ST4. Targeting a fold (UR36).** Clicking the group targets the rat that acts next. That rat splits out with the Target tag, and the log names it ("You hit Wolf rat D"). The group's ticks show which rat that will be: the brightest tick acts first.
- **ST5. The dead fold too.** Dead rats collapse to one quiet line: "Wolf rat G, E · dead". It replaces the full dead row and its odd yellow font.
- **ST6. Folds stay within one kind.** Different species, an elite or a named foe stay in their own rows.
- **ST7. Nothing to save.** The fold is drawn from fight state every render (who is hurt, targeted, observed), so it needs no save field (MC3). Reload gives the same picture.
- **ST8. Room for later.** A group row is where a future area move (a sweep or a shout) would aim, and where MC1's state word sits for the group.
- **ST9. FT9 stays as a fallback.** With folding, a pack of eight usually needs two to four rows. The grow-before-scroll rule then matters mostly in mixed fights.

**More to consider:**
- **Hover on the group** lists its members and their one observed difference, if any, so the fold hides no fact.
- **Damage trail (AK1)** lives on each split row; an untouched group has no trail to show.
- **Pack behaviour.** If wolf rats ever act as a pack (flank, surround), the group row is the natural place for that word ("circling").

### Condensing the UI (CD1 to CD6, 2026-11-21)

Weibao shared a Discord exchange from the Arkivia developer: a tab block of three uneven rows took too much room, and the fix was "realised I can just reduce padding", which fit eight tabs in two even rows. Weibao: "also consider reducing padding and more for more condensed UI?"

- **CD1. A Dense preset exists but also shrinks text.** `styles/variants/dense.css` (PS266, Display › Look › Density) shrinks the spacing unit and drops body text to 12 px. The Arkivia lesson is padding, not text size. Proposal: tighten the default spacing unit a step and leave text size alone, so the default look gains room without a setting.
- **CD2. Rows that grow with the window.** The fighter row height is `clamp(5.3em, 10.7vh, 8em)` (`styles/combat_page.css:28`), so rows get taller on a taller screen with no extra content. Size rows by content (PP2's ~30 px data rows) and let FT9 decide how many fit.
- **CD3. The orphan chip.** At 1920 the Reports filter chips wrap to "Growth … Story" plus a lone "World" on a second row, the exact shape in the Discord picture. Tighter chip padding fits one row; failing that, balance the two rows (TvStatic's alignment point).
- **CD4. Two-line move buttons.** Each move button stacks its label over "3 beats". The beats could sit right of the label on one line at 1920, falling back to two lines at 1280. That halves the strip's height. Proposal; test against FT5's longer cost lines.
- **CD5. Floor.** Click targets stay at least 24 px tall and text stays at the chosen size. Condensing removes air, not legibility.
- **CD6. Use the space you save.** Condensing alone leaves the centre emptier. Pair it with FT9 so freed height goes to the roster and the log.

### One page without scrolling (OP1 to OP8, 2026-11-21)

Weibao: "Sure, general padding things and more? try to make things all in one page wihtout scrolling? more to consider?" Evidence: a headless census of every visible scroller on the rebuilt game (fresh, mid and crowded fixtures plus the seven-rat pack fight) at 1920×1080 and 1280×800, 2026-11-21. Measured, not estimated.

- **OP1. The page never scrolls; panels do, beside empty space.** No case scrolled the page itself. Every scroll is a panel that runs out of room while a neighbour sits half empty. Pack fight at 1920: the roster hides 61 px (Wolf rat A is off the top) above about 450 px of empty centre. Mid save at 1280: the Here panel hides 229 px while the Village column below its four rows is empty. So the main fix is giving height to the panel that needs it, more than padding. FT9 already does this for the roster; this generalises it to columns: a column's cards share its height by content, and only the card with more content than room scrolls.
- **OP2. Lists may scroll; cards may not.** The crowded inventory is 4,744 px tall in a 583 px box. No padding fits that. Proposed rule: a card (fight, bench, Here, Hero) fits without scroll at 1280×800; a long list (inventory, Reports log, ledgers) may scroll, shows how much is below ("12 more"), and folds repeats first (AK12, pack fold ST2). Candidate UR for Weibao.
- **OP3. Here entries carry prose.** At 1280 each "Things here" entry takes three lines because its description sits under the name ("Gather common herbs and inspect your carried materials and preparations"). Move descriptions to hover, as SD1 did for the wolf's prose. That alone removes most of the 229 px.
- **OP4. One spacing unit, one step tighter (CD1).** Spacing comes from one value, `--ui-space-unit` (`styles/ui_tokens.css:237`, body size ÷ 14), with panel padding `--ui-space-panel` = 8 px at 14 px text. Tightening it one step changes every surface at once and leaves text size alone, unlike the Dense preset, which also drops text to 12 px. "General padding things" reads as a yes to trying it; it still needs a side-by-side at both widths before it lands, because every panel moves.
- **OP5. Clipped Condition box (bug).** The left dock hides 15 px at 1920 and 39 px at 1280 in the pack fight, so "Body · Human" under Condition is cut off. Fit it, or fold Condition to one line when there are no effects ("No active effects · Body · Human").
- **OP6. Potion bench scrolls.** The bench card scrolls at 1920 in the potion feel pass's own capture (Obtain, Prepare, A bit of the person run below the fold). It is a card, so OP2 says fit it: the three steps could sit as collapsed sections with only the current step open.
- **OP7. Chrome takes three bars.** Top status bar, the centre tab bar (Actions, Crafting, Mixing, Keys) and the bottom navigation together take about 90 px at 1280. The centre tabs could join the place header's own tabs (Actions, Home, Workshop, Options already sit there). Proposal only.
- **OP8. Four columns at 1280.** At 1280 the Reports column is mostly empty early in a session while Here scrolls. Options: narrow Reports at 1280, or let Here and Reports share one column with tabs. Proposal; Weibao's call, since the left-to-right reading order (you, them, log) is decided.

Scope: OP4 and OP1 touch every surface and the shared tokens, so they belong in their own lane after the combat feel pass, not inside it. OP5 is small enough to ride with the combat pass. OP2 and OP8 need Weibao's decision.

### Stacked bar for mass combat (MS1 to MS10, discussion 2026-11-21)

Weibao: "I meant stacked into one bar, thoughts? for like mass combat? ... if I can only attack one layer of bar at a time? take 5x damage but can only attack the outermost hp bar unless I have multihit or something?" This is a fight mechanic, not a display change, so it is not part of the combat feel pass. Closest model: Heroes of Might and Magic creature stacks (one unit, a count, the top creature's HP, damage scaling with the count). Weibao's version differs where it matters: overkill does not spill into the next layer.

- **MS1. One thick bar, layers as segments.** The group shows as one thick bar divided into one segment per member, with the count inside ("Wolf rats ×8 · front Hurt"). It keeps one bar form (UR166). The outer segment drains first; when it empties, the count drops.
- **MS2. No spill (Weibao's rule).** A hit damages the outer layer; overkill is lost by default, and multi-hit or sweep moves are the exception. That makes multi-hit moves, sweeps and area powers the answer to crowds, and big single hits the answer to one tough foe. Show "3 overkill lost" the first few times so the player learns why.
- **MS3. Multi-hit doesn't exist in tempo fights yet.** Bodies carry `attack_count`, but `src/tempo_fight.js` doesn't read it. MS2 needs a multi-hit or sweep move to land first, or crowds become a slog.
- **MS4. Front width caps the damage.** "5x damage" from eight rats at once would spike. By default the front rank alone reaches you: a width (say three) set by the place. A corridor gives width one, open ground the whole crowd. Chokepoints matter for free.
- **MS5. Rank order means something.** In a mixed crowd, the outer layer is the front rank: a shield line in front, archers or a leader inside. You chew through the front to reach the leader, unless a move reaches past.
- **MS6. Crowds break.** Losing about half the layers routs a crowd, the way wolves run when hurt enough. That is often the real win condition, not the last layer.
- **MS7. Where it applies.** Stacks for real mass fights (a riot, a horde, a Gu swarm, a battle line), set by the encounter. Ordinary packs of up to eight keep ST2's fold, because spare, take alive and harvest work per body there.
- **MS8. The count is observed (SD1).** "About a dozen" until counted.
- **MS9. Rewards and records per layer.** Loot, harvest, experience, bestiary kills and quest counts ("Wolf rat 0/10") count each peeled layer.
- **MS10. Save shape.** A group fighter with a count and an outer-layer HP is new saved state, so it needs a migration decision (MC3). Weibao's standing position is that old saves are disposable. Fight draws stay keyed (MC2).

Route: the mechanic-absorption skill, as a bounded slice (one horde encounter, one sweep move, width from footing), after the combat feel pass lands.

## Arkivia source read: travel, stats and daily life (discussion, 2026-11-21)

Weibao: "consider feature and ui implementation from https://just-pointless.github.io/arkivia/ Does higher speed stat make travel faster? check game code", then "Save and then we can implement right now, are there other protolikes out there? We should make stats apply to daily life too?"

Source: the served `game.js` of v0.26.1 (6,374 lines), read statically on 2026-11-21. Nothing was played. This extends AK1 to AK15 above, which came from the changelog only. Arkivia is already listed as a Proto23-inspired repo in the [fork audit](../../../research/PROTOLIKE_FORKS_AND_SIMILAR_GAMES_2026-10-30.md); this is its first code read.

| Code | Arkivia (source) | For us | Disposition |
|---|---|---|---|
| AK16 | Speed does not touch travel. `getMovementSpeed()` is `(50 + Walking level × 3) × min(1, max weight ÷ carried) × energy factor`; energy below 35 scales by `energy/70 + 0.5`. Speed sets hit chance against Dexterity and turn order; fog cuts Speed by 25% | Our native journey already takes ×0.8 with Running revealed and at level 1 (`src/main.js`, both travel paths). No primary stat, load or body state changes travel minutes today | Answered; see AK18 |
| AK17 | Arrival clock: a walk says "You'll arrive at HH:MM" and recomputes when Walking levels or load changes | Our exits show bare minutes, and those minutes did not include the Running ×0.8 that the journey charges, so the label overstated the trip by a quarter while running | Building: one journey quote feeds the label, the charge and an arrival time |
| AK18 | Activity skills speed only their own activity: crafting, alchemy, exploring, mining, felling, hunting each `1 + 0.05 × level`, times tool efficiency, times the energy factor | Same shape as our Running ×0.8. The question is whether primary stats join skills in daily life; options DL1 to DL3 below | Weibao to pick |
| AK19 | Choices are written into scene prose as `{![icon]Label|scene|distance}` links, numbered for the keyboard; a link with a distance becomes a walk | Our location choices are separate buttons. Inline numbered choices fit text-led scenes (lead-life prose) better than a menu | Later, with scene prose |
| AK20 | Titles gain points from activities (Walker from walking, Miner from mining) and achievements check running totals such as distance walked | Fits our reports and known-things: a lifetime tally per activity ("walked 41 km") is cheap honest flavour | Later |
| AK21 | Skip travel under N minutes still spends the time and grants the Walking XP | Matches AK7's condition: time passes, attention does not | Already the condition in AK7 |

### Stats in daily life: options (2026-11-21)

Today stats act in fights and through stamina and health pools. Daily activities read skills, tools, hours and body facts (BHR16: a tired body works slower; harm dials give legs a `speed` axis for `travel`), but the harm and fatigue multipliers reach no travel or work duration yet.

- **DL1. Wire the body state we already compute.** Harm and fatigue multipliers (`actionModifiers(save, action)`) scale travel and work time and show as lines in the same breakdown. Already accepted direction (BHR16, accepted 2026-10-18), so it needs wiring, not a decision.
- **DL2. A declared stat per activity class.** Agility for travel, strength for hauling and labour, intuition for study, dexterity for craft, each a gentle capped multiplier beside the skill. Legible and Arkivia-like; risks double counting with Running and other skills, and flattens different lives into the same five dials.
- **DL3. Stats open methods and limits, not speed (unusual).** Strength sets how much you can carry on a trip and which loads need two trips or a cart; agility opens a rougher shortcut route; intuition reveals a second option in a study or trade. Fits OOPS's situation modelling better than fixed formulas, and makes stats change what a day looks like instead of shaving minutes.

Recommendation: DL1 now, then DL3 for one activity (carrying on travel) as a test; keep DL2 out unless DL3 proves too heavy.

### Other protolikes found (2026-11-21)

A sonnet web lane, labels [V] read on the page, [I] inferred. Already recorded elsewhere and not repeated: Progress Knight, Idle Loops, Kinfolks, Groundhog Life, Cycle of the First Dawn (see the [protolike discovery](../../../research/PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md), [fork audit](../../../research/PROTOLIKE_FORKS_AND_SIMILAR_GAMES_2026-10-30.md) and [itch screen](../../../research/ITCH_IO_IDLE_SCREEN_2026-10-22.md)). New:

| Code | Game | What to look at |
|---|---|---|
| SG1 | [Idle Mage Life](https://szklanka-herbaty.itch.io/idle-mage-life), a Progress Knight derivative | Skills with life effects, not combat ones: Bargaining lowers expenses, Patience raises happiness, Holy Body adds lifespan [V]. Players report some do nothing [I] |
| SG2 | [Stillmarch / idle-legends](https://github.com/kttalley/idle-legends) | Weather as a map layer (rain, fog, blizzard, sandstorm) and one-click gather, craft and fight modes [V]. No hosted build found |
| SG3 | [Idle Hero](https://github.com/alexis-labs/idle-hero) | Timed travel with fog of war and offline travel capped at 24 hours [V] |
| SG4 | [Greenhollow](https://github.com/3ecas/RPG) | Text idle RPG with mining, woodcutting, fishing, farming and crafting stations [search snippet only; the repo page returned 404] |
| SG5 | [Realm Eternal](https://scitsy.itch.io/realm-eternal) | Build, assign and explore across lifetimes [listing only] |

None confirm Arkivia's full set of clock, weather, distance travel with arrival times and stat breakdowns. Proto23 remains the family root; Arkivia's README credits it.

### Layered bars: one bar, many layers (LB1 to LB8, discussion 2026-11-21)

Weibao: "We can use the same style for people with multiple hp bars and more? Like layers of bars? we cab search online for like jrpgs and stuff that does these". The in-game mock (`docs/representations/evidence/combat-pack-mock-2026-11-21/`, round 2) built the crowd case. Precedents found:

| Game | How it shows several bars | Source |
| --- | --- | --- |
| Kingdom Hearts (first game) | Coloured layers on top of each other, drained one at a time; each full layer is a fixed amount (300 HP), colours run green, yellow, orange, pink, purple | [KH Wiki](https://www.khwiki.com/Focus) |
| Kingdom Hearts II and later | One bar, plus a small green block under it for each full bar still to go | [KH Wiki](https://www.khwiki.com/Focus), [Twinfinite](https://twinfinite.net/guides/kingdom-hearts-3-see-enemy-hp-how/) |
| Terraria (Celestial Pillars) | A shield bar overlays the health bar | [Terraria Wiki](https://terraria.wiki.gg/wiki/Boss_health_bar) |
| Calamity Mod / Metal Gear Rising | Multi-part bosses get a bar per part | [Calamity Wiki](https://calamitymod.wiki.gg/wiki/Boss_Health_Bar) |
| Octopath Traveler | Shield is a separate number on a shield icon; zero means Break, then extra damage | [GamerGuides](https://www.gamerguides.com/octopath-traveler/guide/introduction/game-mechanics/battle-system) |
| Many action games | Each emptied bar changes behaviour (the "turns red" pattern) | [TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Main/MultipleLifebars) |

- **LB1. One component, many uses.** The layered thick bar (top layer drains to reveal the next, ×N chip on the left, state word beside it) serves a crowd (a layer per member), a boss or a strong person (a layer per phase or reserve), and a ward or armour (an outer layer of a different kind over health). Still one bar form (UR166).
- **LB2. Show the next layer rather than empty track** while layers remain, so "still standing" reads at a glance. The last layer drains to the normal empty track.
- **LB3. The chip says how many, in words.** "×6" for a crowd, "×3" for a three-phase foe. Unknown counts read "×?" until observed (SD1): a stranger's reserves aren't known on first sight.
- **LB4. Layers of a different kind get a word as well as a colour.** A ward layer reads "Ward" in the chip; health reads as today. Colour ceiling: red for health plus at most two layer tints (CH rules, UR37).
- **LB5. KH II's pips are the compact fallback.** When a row is narrow (1280, a party row), the chip can collapse to small blocks under the bar, one per layer behind.
- **LB6. A layer emptying is an event.** It is the natural point for a phase change, a rout check for a crowd (MS6), or a ward breaking (Octopath's Break). The bar marks it once (VR04), and Reports names it.
- **LB7. Fixed layer size where the layer is a pool.** KH makes each full layer the same amount, so the count also reads as total health. For crowds the layer is a member, so sizes follow members.
- **LB8. Mechanics come separately.** The bar is display. Wards, phases and crowds each need their own fight rule and save shape (MS1 to MS10, MC3) before they use it.

## A visual feel of our own (discussion, 2026-11-21)

Weibao: "in what way should we be inspired by their Uis and more?", then "Can we give ourselves a unique visual feel much like Yair and Arkvia do so for themselves?"

Evidence: headless 1920x1080 captures, [Arkivia](../../../representations/evidence/identity/arkivia-headless-1920.png) (headless Chrome tripped its mobile layout, so this is its narrow form) and [OOPS at the willow stand](../../../representations/evidence/identity/oops-willow-1920.png) (fresh-day3, after one walk).

We already have an identity on paper: Luminous Gothic (DSG2, accepted 2026-10-29), glyph tokens (DSG4), whimsy in voice (DSG3). The capture shows why it does not yet read as ours: every panel has the same glowing frame at the same weight, the centre pane, the largest area, is empty, the skill bars are upstream flat green, and nothing on screen is something only OOPS does. Arkivia and YAIR are recognisable from restraint: one dominant stage, a handful of colours that each mean one thing, one voice. Take that discipline, not their look.

- **VI1. A stage.** The centre pane holds the place: its prose, then its choices written inline and numbered (AK19), with work in progress animating there (AK9). It is never blank (DSG9). This is Arkivia's main lesson and our largest gap.
- **VI2. A colour grammar.** Few colours, each one meaning: glow for what you can act on, gold for money and time, violet for memory and Reports, warm red for danger. Everything else is quiet. Frames lose glow unless they hold the current task, so the focus reads at a glance (DSG1, UR60).
- **VI3. The glyph as signature.** No peer marks subjects with CJK glyphs; we already do (夏 in the header). Make it consistent: every person, creature, place kind and season carries its glyph, in one size and colour role (DSG4, DSG12 per world).
- **VI4. A sky band.** The top bar takes its tint from time of day and weather, the way Arkivia's clock strip is its own colour; the arrival clock (AK17) and weather sit in it.
- **VI5 (unusual). Marginalia.** The "optimistic" in OOPS as a visible voice: a narrator's short asides in the margin of the stage, dry or warm per DSG3, never carrying rules. This is the one element neither peer has, and it fits the project name.

Order: VI1 and VI2 first (they fix what reads as generic today), then VI3 and VI4, VI5 as a prototype (prototype-to-decision) before it is a rule. Per-world skins (DSG17) stay later; they need a base this strong to vary from.

### Wider directions, not limited to Luminous Gothic (2026-11-21)

Weibao: "we dont need to limit ourselves to specifc design ideas thus far". So DSG2, DSG4 and VI1 to VI5 are inputs, not limits. The conventional answer is a new skin (palette, font, frames) over the same panel grid; the assumption behind it is that identity lives in the surface. The detail that changes it: OOPS is many lives in many worlds, read for hours, mostly as prose and reports. The constant across worlds is the life being lived, so the identity can come from what the screen *is*, not only how it is painted.

Four directions, mocked on the same moment (arriving at the willow stand in rain, wet and cold, three choices): [mockups](../../../representations/evidence/identity/directions-2026-11-21.png) ([source](../../../representations/evidence/identity/directions-2026-11-21.html)).

| Code | Direction | The screen is | Walk: where am I, what's wrong, what can I do, how long, resume after idle | Cost and risk |
|---|---|---|---|---|
| ID1 | Luminous Gothic, tidied (baseline) | An instrument panel | All facts visible at once; focus shown by the one glowing frame | Cheapest. Still reads as a YAIR descendant |
| ID2 | The almanac | A page of the life, written as you live it: dated head, place as a title, prose, numbered choices in the text, margin notes, the day's record below | Place and trouble read in one sentence ("sleeves already wet through"); choices and arrival time sit in the prose; on return the page has grown by what happened | Prose-first worlds fit at once. Dense comparison (inventory, fights) needs a ledger page in mono tables. Must stay dark paper, never beige parchment |
| ID3 | The observatory | A simulator console watching a subject: worlds as channels, event stream, a 24-hour life trace | Facts fastest to scan; the life trace shows the idle stretch at a glance | Fits the name and many worlds. Cold, dashboard-like, at odds with whimsy (DSG3); an all-seeing observer sits badly with sealed secrets |
| ID4 | The diorama | A small illustrated tabletop of the place, the hero as a token, choices as cards | Most immediate and most charming | Needs art for every place in every world. The highest content cost by far |

A fifth idea works as a layer on any of these: **ID5, the subjective lens**. The interface shows the character's state (rain streaks the page when wet, frost at the edges when cold, contrast softens when exhausted), within readability limits and only what the character perceives.

Recommendation: **ID2 as the frame**, with a ledger mode for numbers (ID1's density, in mono tables), ID3's world channels and life trace as page elements, and ID5 as a light layer. Each world inks the almanac its own way (Tingen newsprint, Hogwarts quill ink, Gu bamboo slips), which gives DSG17 skins a natural form. ID4 stays a later idea for places that earn art. State ownership does not change: every direction reads the same read models; this is layout and skin, not a new model.

What could reverse it: whether the almanac holds up in a fight and in inventory at 1920. Smallest test: prototype-to-decision with the real game DOM, a Village day page, a fight and the inventory in ID2 against ID1, each screenshot side by side. These are proposals; DSG2 remains the accepted default until Weibao changes it.

### Weighing the roster options (UO1 to UO8, discussion 2026-11-21)

Weibao: "Also consider the merit of the other Ui possibilities and more?" Ranked by fit for the current game, with what each is best at. Fold and FT9 are sent; the rest are kept for the case they suit.

| Code | Option | Best at | Cost | Verdict |
| --- | --- | --- | --- | --- |
| UO1 | Fold the untouched (ST2, sent) | Packs up to eight; every rat stays targetable and keeps its own state once it differs | Rows change count as rats split out | Default for packs |
| UO2 | Layered bar (LB1, mocked) | Crowds, multi-phase foes, anything read as "how much is left in total" | Hides individual state (F3); needs a mechanic | Crowds and bosses, after MS rules |
| UO3 | Condensed rows (CD2, sent) | Every fight; free height | Readability floor at 1280 | Do with UO1 |
| UO4 | Grow before scroll (FT9, sent) | Mixed fights the fold can't shrink | Uses centre space the log could use | Fallback |
| UO5 | Two columns of half-width rows | Large mixed fights (a dozen distinct foes) without scrolling. Rows are 870 px wide at 1920 and mostly empty stat line | The stat line already wraps at 1280 in one column; two columns would need the stat line trimmed to Atk and one more | Untested; worth a mock if mixed fights of nine or more appear |
| UO6 | Segmented bar (the first stack mock) | Showing how damage is spread across a group | Six tiny drains are hard to read at a glance | Use as the hover detail of a layered bar, not as the bar |
| UO7 | Thin stacked bars (option A) | Compactness | A second bar form and many words to scan (UR166) | Rejected |
| UO8 | Kingdom Hearts II pips under one bar | Narrow rows (party rows, 1280) | Count reads as blocks, not words | Compact form of LB3's chip |

### Shield as its own bar (SH1 to SH9, discussion 2026-11-21)

Weibao: "for shield, it can be a seperate bar on top that drains differently and more?" Yes: a separate bar fits better than a layer, because a shield follows different rules from health, and putting it in the same bar would blur them. Precedents: Terraria's pillar shields overlay the health bar ([Terraria Wiki](https://terraria.wiki.gg/wiki/Boss_health_bar)); Octopath Traveler counts shield points and breaks at zero ([GamerGuides](https://www.gamerguides.com/octopath-traveler/guide/introduction/game-mechanics/battle-system)). Shooters such as Halo regrow a shield when not hit (general knowledge, not checked here).

- **SH1. Today's shields aren't pools.** In tempo fights a ward (`foe.ward`, `TEMPO_DIALS.wardCast` in `src/tempo_fight.js`) lowers the chance and damage of hits, and `profile.shield` is a block chance from gear. Neither runs out, so for now they stay a word in the row's condition ("Warded"). A bar appears when a shield becomes an amount that drains.
- **SH2. Shape.** A thin bar directly above the thick health bar, full width, in a shield tint with its own word at the left ("Ward 3 hits", "Ward · regrows"). The fight card already uses a thin bar for timing under the health bar, so thin above and thin below reads as "things that wrap health". Health stays the one thick bar (UR166).
- **SH3. It drains its own way, and says how.** Pick per shield kind, and show the rule in its word:
  - **Hit count:** each hit removes one pip, whatever its size, until it breaks (Octopath). It rewards many small hits.
  - **Damage pool:** it soaks damage first and the overflow reaches health. It rewards one big hit.
  - **Weakness:** one kind of hit (fire, silver, a spirit attack) drains it; other kinds glance off. It rewards knowing the foe (SD1: the weakness shows once learned).
  - **Regrowth:** it refills after a set number of beats untouched. It rewards pressure.
- **SH4. Breaking is an event.** At zero the bar flashes once and is gone, the foe staggers or opens (the existing "Opening" condition), and Reports names it ("The wolf's ward breaks"). This is the Octopath Break payoff, and it fits VR04.
- **SH5. Pierce and bypass.** Some moves ignore the shield (a thrust through a gap, a curse past a charm). The harm preview (FT4) shows when a move would hit the shield and when it would reach health.
- **SH6. The player's shield uses the same bar** in the Hero panel, above the Hero HP bar, so a Gu guard or a ward charm reads the same on both sides.
- **SH7. Observation first.** An unseen shield isn't drawn. A sensed but unmeasured one shows the thin bar with "Ward ?" and no fill.
- **SH8. Layered bar plus shield.** A crowd can carry a shield wall: one shield bar over the front layer, which breaks before the front rank can be hurt. That combines MS5 (rank order) and SH4.
- **SH9. Mechanics first.** A drainable shield is a fight rule and a saved amount (MC3). The bar follows the rule, not the other way round. A first slice could be one guarding Gu with a hit-count shield.

### Gaps to watch for in a normal play session (GP1 to GP5, 2026-11-21)

Weibao plans to play normally to find gaps. Things these discussions predict, worth noting when they happen:

- **GP1.** Any time you scroll a panel while space sits empty beside it (OP1).
- **GP2.** Any time a word says "?" or a guess where you felt you should already know (SD1 gaps).
- **GP3.** Any time a fight row, button or bar moves without you doing something (ST3, FT9).
- **GP4.** Any time you reach for a move or item that isn't where you expect, or needs a second click (RS rows, item belt).
- **GP5.** Any time the result of an action vanishes before you've read it (VR19).

### More to consider on the roster and bars (MT1 to MT8, 2026-11-21)

Weibao: "update ideas and implementation accordingly? /more-to-consider".

- **MT1. ACT NOW, done: the fold moved the buttons.** Splits added rows, so the move strip dropped 84 px mid-fight in the mock, against RS and FT9. The mock now reserves the roster's height at fight open and the buttons stayed put through five strikes (pack mock round 3). The brief's item 13 carries it. Cost: the fold saves rows to read, not height, unless FT9 later reserves fewer rows than opponents.
- **MT2. ACT NOW, done: absorbing the mock.** Merging the mock branch would bring its snapshot base of 422 uncommitted files. The brief now names the three commits to take and says not to merge. I also corrected FT10's commit hash (`4b752f611`, not the stack branch's `6dad665e9`).
- **MT3. ACCOUNT FOR NOW: guards and wards don't show on the row.** A raised guard or ward shows as a log line and nowhere else, because the row's conditions list body parts. SH1's "stay a word" assumed a place that doesn't exist yet. Added to the brief's item 1 (VR01).
- **MT4. ACCOUNT FOR NOW: reload and the sticky split.** The mock keeps "has split" on the roster element for one fight. Hurt, conditions and observations are saved, so those splits survive reload; a rat that split because it was targeted earlier re-folds after reload. That's a row moving on load, which GP3 would catch. Accept it, or record "was targeted" in the fight's saved state (a save change, MC3).
- **MT5. ACCOUNT FOR NOW: the shield bar's thin-bar meaning.** The fight card already uses a thin bar for timing. A thin shield bar above health makes "thin bar" mean two things; the tint and its word ("Ward 3 hits") tell them apart, and the shield bar sits above while timing sits below. Check it in a mock beside the timing bar before building.
- **MT6. LATER: layered and shield bars share one component.** Both are variations of the thick bar (a revealed layer behind, an extra thin bar on top). Build them as options of the existing `track('health', …)` in `src/combat_situation_ui.js` so the Hero panel can use the same one (SH6), instead of a second widget.
- **MT7. LATER: a counted-shield first slice.** One guarding Gu whose ward takes three hits (hit-count, SH3) is the smallest mechanic that makes a shield bar honest. It needs a saved count in the fight record and a migration note.
- **MT8. LATER: retire the mock branches on decision.** The fold is decided, so once the combat feel pass lands it, MW9 retires both mock branches and `~/code/yarpg-mock-combat-pack`. Keep the stack branch until Weibao decides LB and MS.

### Chosen: ID1 in Arkivia's palette, as Graphite (2026-11-21)

Weibao chose the baseline (ID1) with Arkivia's dark palette. Shipped as the Graphite theme and the new default ([screenshot](../../../representations/evidence/identity/graphite-village-1920.png)); ID2 to ID5 stay on file as ideas. Graphite keeps colour for meaning only (VI2): blue for what you can act on, gold for money, violet for Reports, green, red and blue vitals.

Seams (same day): under Graphite the panels meet edge to edge with a single hairline per seam, and Here's lists are hairline-split rows instead of nested boxes ([screenshot](../../../representations/evidence/identity/graphite-seamless-1920.png)).

**Darker, and actually on screen (DK1 to DK5, 2026-11-22).** Weibao: "consider making the default a more dark arkivia style". Graphite already is the default for a new player (`DEFAULT_LOOK`, `src/customization_profiles.js`, uncommitted in the primary checkout). His fight frames still show navy Luminous because a save keeps its look. The one-time move to Graphite only fires for a save whose look was never touched (`upgradeUntouchedCustomization`). The capture fixtures and his own saves carry a changed profile, so they stay navy.
- **DK1 (recommended). Every save moves to Graphite once.** Old saves are disposable and he is the only player. Luminous stays selectable under Display › Look, and a profile he built by hand is kept as a second profile rather than overwritten.
- **DK2 (recommended). Darker, by Arkivia's measures.** Panels sit on #1e1e1e to #262626 under a #222 page, with no box frames: one hairline per seam, as Graphite seams already do. Text #eee. Buttons are flat with a thin blue-violet edge (Arkivia's #3a3a8a). Colour is kept for meaning: the vitals, gold for money, blue for actions. Reports drops its violet slab for the same dark ground, and the colour moves into the line kinds (END6).
- **DK3. Arkivia's log form for fights.** Short centred lines ("Wolf → 4", "You missed") with the number coloured by who took it. The long sentence goes on hover (END7, UR178).
- **DK4. Bars read Arkivia's way.** Saturated fill, centred "HP 7/10" text, no frame. The hero bars are close already; skills now match (SKC1).
- **DK5 (unusual). The top band takes the sky.** The status line is tinted by time of day and weather (VI4), the one place colour carries the mood on an otherwise grey page.

Recommendation: DK1 and DK2 now, DK3 with the fight log, DK5 later. Not decided.

### Bringing a target to the front (TF1 to TF6, 2026-11-21; built: "implement entirely")

Weibao: "Maybe we can reorganize by being able to target a specific one and bringing one up to the front?", then "lets consider implementations and then decide on the best one". Read from the main checkout while the combat feel lane is mid-pass: the fold (`foldTempoRoster`), FT9 sizing (`sizeRoster`) and the FT4 harm preview (`bindHarmPreview`) are in its uncommitted work. The chosen target is `inspectedOpponent`, held by the card and not saved; the engine falls back to `target(b, 'player')`.

| Option | Build | Cost and conflicts |
| --- | --- | --- |
| **TF1.** Move the target's row to the top | Sort entries in `renderRoster` so the target comes first. About five lines. | The clicked row jumps away from the pointer, and every retarget reshuffles the list. Breaks the fixed-place rule in spirit. |
| **TF2.** Pin the target row in place | One CSS rule: `.fight-page-roster [data-target="true"] { position: sticky; top: 0; bottom: 0; }`. The list keeps its order, and the target stays visible when the list scrolls. The scroll-to-target line in `sizeRoster` becomes unneeded. | Does nothing when the list fits, which is most fights once the fold and FT9 land. Needs a background so rows don't show through. |
| **TF3.** A fixed target slot above the moves | A new element between roster and move rows, filled by the same `fighterEntry` (one bar form). The harm preview binds to the slot's bar, next to the buttons. List rows become compact. | Compact rows can drop the stat line and little else: VR01 keeps conditions on the row, and the timer bar is how you see who acts next. So the saving is one line per row. Reverses part of FT3 (no target strip). Damage trails are keyed by subject, so the slot needs its own key. The slot holds a fixed height so the buttons stay put (MT1). Tests that look for the target in the roster need updating. |
| **TF4.** "Single out" in a crowd | A move, in Body or Terms, that pulls a chosen member to the front layer of a stacked crowd (MS1). Engine: a front order per crowd on the native battle, attacks without multihit land on the front, and single out costs beats and may let the crowd close in. | A save shape change (MC3 rules it out of this pass) and a rules slice. Means nothing until the stacked crowd mechanic exists. |
| **TF5.** The crowd rotates its own front | Engine policy: a hurt front member falls back and a fresh one steps up; positioning (a flank) changes who is exposed. | Harder to read than TF4. Later, once TF4 shows how crowds play. |

**TF6. Proposed decision.** For the ordinary list, keep the order and add TF2: one rule, no new component, and it covers the case where a list still scrolls. Skip TF1. Put TF3 and TF4 together with the stacked crowd (MS): a stack has no row per member, so the slot is where the singled-out member's conditions and timer go (F3, F4), and single out is what makes "bring one to the front" a choice. TF3 on its own buys little while every foe has a row. Not decided.

**Built (Weibao: "implement entirely", 2026-11-21).** TF2 to TF5 are on branch `feat/crowd-front-2026-11-21-r2`, rebased onto the combat feel polish (worktree `~/code/yarpg-crowd-front`), with a real encounter, Fang Yuan's "Hold a gap in the wall against a wolf pack". TF1 was left out because it conflicts with TF2. Receipt with browser proof and save, reload, export and import: [crowd-front](../../../representations/evidence/crowd-front-2026-11-21/README.md) on that branch. Not built: front width (MS4), rout (MS6), an observed count (MS8), and Sweep coming from a weapon rather than every crowd fight.

**Bar words removed (Weibao: "we dont need the fresh descriptors", 2026-11-21).** Foe health bars no longer print "Fresh", "Hurt" or "All fresh". The fill carries the state, the word stays in the hover and the screen-reader label, and a learned number still shows. This supersedes the bar part of FT10; the Hero panel is unchanged. The combat feel lane (resume-2) builds it with no drawn preview word either; the bar shows the fill, the trail and the harm stripe. The branch commit `6e86c68dc` is dropped at rebase in favour of the lane's version.

### Away time in Reports (BT1 to BT6, discussion 2026-11-21)

Weibao: "the unbanked time lost might be worth not including, we might want a more narrative way for that? Should we make the banked time info be else where? Anything we can learn from arkivia?" Today the "While you were away" row pinned at the top of Reports (`src/return_digest_ui.js`) reads: "You were away for 323 days (465,120 minutes). The bank holds 7 days, so 316 days went unbanked. Banked time: 7 days. Spending it plays your current routine forward at the normal pace and stops at any choice." Under it sits a "Spend 1 h of banked time" button.

What Arkivia does, from Weibao's picture: Reports is a flat feed with one fact per line, each led by its number ("You -> 40", "+5 XP", "+0.072 (+0.036/s) Dexterity", "Used x1 Exercise Pill"). A skip is one line in the feed at the moment it is spent ("Timeskipped 5 minutes"). No standing paragraph explains the rules.

- **BT1. Drop the unbanked sentence.** Time over the cap is not something the player can act on, so the line reads as a fine. The cap goes in the bank control's hover ("holds up to 7 days").
- **BT2. A narrative heading for the absence.** Lead with what the world did, in the digest's own span words: "While you were away · most of a year". The groups below already say who did what. The exact minute count moves to the hover (UR161 keeps it available).
- **BT3. Banked time moves out of Reports, as a spendable resource.** It becomes a small control in the top status line next to the clock: "Banked 7 d · Spend 1 h". That sits where the player plans the day, and it works like essence or money: you see it and spend it there. Reports drops the pinned bank paragraph.
- **BT4. Spending writes one Reports line, Arkivia style.** "Spent 1 h of banked time: routine played forward to 07:00." It is a single line in the feed, written when you spend, like Arkivia's "Timeskipped 5 minutes".
- **BT5. Number-led feed lines (from Arkivia).** Gains and losses lead with a signed number ("+5 XP", "+0.07 Dexterity"), with a rate in brackets where it helps. This matches the AK3 number format already in the feel-pass rules.
- **BT6. Unusual option: say lost time as a scene.** Instead of a count, one diegetic line on a long return: "Months went by that you do not remember living." It is fiction, not accounting, and fits the life-sim. Use it once per return.

Recommendation: BT1, BT2, BT3 and BT4 together. They are one display change in `return_digest_ui.js`, plus a status-line control that reuses the existing spend command. No save change. BT6 is optional flavour on top of BT1. Not decided.

### Packs that never split (NS1 to NS9, discussion 2026-11-21)

Weibao: "How about no splitting? rats? more to consider?" Today a pack folds into one row ("Wolf rat ×4") and a rat splits into its own row once it is hurt, targeted, under an effect or observed differently (ST2 to ST7, built by the combat feel lane). The crowd work added the pieces for another way: member picks on one row, and a target slot (TF3).

- **NS1. One row per kind, all fight.** Identical foes keep one row from start to end. Letter picks (A to F) choose the target, and the target slot under the roster shows the chosen rat's full row: bar, conditions and timer. This is the crowd row minus the front rule, since in a pack any rat can be hit.
- **NS2. The bar's shape says the rule.** A pack bar has one segment per rat, each with its own fill, and the target's segment is outlined: anyone can be hit. A crowd keeps the layered bar: the front first. Two rules, two shapes, one bar family (UR166).
- **NS3. Each rat's state on its letter.** A thin fill under the letter shows health, a dead rat's letter is struck through and dimmed, and a dot marks a condition or an observation that differs from the rest (F2). Hover gives the words. The timer keeps one tick per rat, lettered.
- **NS4. What it removes.** No row ever moves, so the reserved-height fix (MT1) and the reload question (MT4, the split-out save bit) both go away with no save change. `foldTempoRoster` and the split set can be deleted.
- **NS5. What it costs.** Two rats' conditions can't be read side by side; you see the target's in full and the rest as dots. If the hurt rat B and the shaken rat D both matter, you flick between them.
- **NS6. Where it stops.** One row per kind; a mixed fight has a row per kind. Elites, named foes and lone foes keep their own rows. About eight letters fit at 1280; past that, a fight is a crowd (MS) by design.
- **NS7. Targeting.** Clicking the row's name targets the rat acting next (today's fold behaviour), and a letter targets that rat exactly. Keys A to G are taken by Body moves, so arrow keys move between letters once the row has focus.
- **NS8. It extends TF3 to every pack fight.** The target slot appears whenever a row holds more than one foe. A fight against one wolf has no slot, because its row is the target. This reverses more of FT3 ("no target strip"), and the slot earns it by holding the detail the rows give up.
- **NS9. Unusual option: no pack rows at all.** The pack becomes a strip of letter chips with mini bars, like a party frame, and the target slot is the one full row. It is denser again, and it may read as too abstract for a first fight.

Built 2026-11-21 (Weibao: "Build both"): NS1 to NS8, without NS3's fill under the letter or the "differs" dot, which read as noise. Branch `feat/packs-and-away-2026-11-21`, commit `c5a5c54f5`; [receipt](../../../representations/evidence/packs-and-away-2026-11-21/README.md).

### Away time that scrolls away (RS1 to RS5, discussion 2026-11-21)

Weibao: "or at least let it scroll away like the other stuff, and the ability to use them put elsewhere". This picks up BT1 to BT6. The digest is pinned above the Reports stream by `src/event_feed_ui.js` (RPT6 home), and the spend button sits inside it.

- **RS1. The digest becomes a stream entry.** On return it is written once into Reports, at the head of the new lines, and scrolls away like any other entry. It files under Story so the filter finds it again. "Mark as read" goes, because scrolling past is reading.
- **RS2. Banked time becomes a top-bar chip.** It sits beside "Today: … · Ready now" in the status line (`src/ui/status_line.js`) and reads "Banked 7 d". Clicking spends an hour through the existing `awayBank` spend command. The hover gives the cap and what spending does. The chip hides at zero.
- **RS3. Spending writes one line,** as in BT4: "Spent 1 h of banked time: routine played forward to 07:00."
- **RS4. The text slims down.** Drop the unbanked sentence (BT1), and lead with span words ("most of a year") with the minutes in the hover (BT2).
- **RS5. Risk.** Reports starts each sitting empty (RPT8), so a digest that scrolls off before you read it is gone until the next return. The Story filter keeps it within the sitting. A long return could also write a short line naming how many people and events are in it, so a quick scroll still shows that something happened.

Built 2026-11-21 (Weibao: "Build both"): RS1 to RS4 with RS5's Story filing, on the same branch. RS3's line reads "Spent 1 h of banked time." The digest is checked once when play starts, so a long sitting does not use up the marker. [Receipt](../../../representations/evidence/packs-and-away-2026-11-21/README.md).

### Where place and time go in a fight (FTL1 to FTL9, discussion 2026-11-21)

FTL stands for fight top line; it is a separate series from FT1 to FT10. Weibao, with a picture of the status line mid-fight ("Village · 01/04/999 08:01, Mon · 夏Summer · Day · Dry 14.7 °C · comfortable · Today: …"): "this presentation still isn't the most optimal… details like attached should be part of the fight area no?"

What the code and the crowd-front screenshots show today ([1920](../../../representations/evidence/crowd-front-2026-11-21/crowd-1-open.png), [1280](../../../representations/evidence/crowd-front-2026-11-21/crowd-1280-3-struck.png)), read for this note:

- **FTL1. The top line's clock is stopped.** An open tempo fight holds the world clock and banks the real minutes as held time (`clock_owner.js` calls `recordTempoHold`; settlement adds `b.held` to `tempo.held_minutes`). So "08:01" stays 08:01 the whole fight, and the held minutes are shown nowhere. The fight's own time is `b.seconds` (about one second per beat), which counts toward `stakes.stopAt`. A grep finds no path from `b.seconds` to the world clock at settlement; that is unchecked by play.
- **FTL2. The line names the wrong place.** "Clan academy" sits on the top line while the card says "A gap in the wall" ([PS30](CONSIDERATIONS.md), row 103, already wants the fight's own place).
- **FTL3. What the fight reads is half hidden.** `mishapChance` in `tempo_fight.js` reads footing, light, rain and fog. The card's header (the fold summary in `combat_situation_ui.js`) shows place plus light and footing in small type. Rain, fog and who is with you appear just in the folded details and the screen-reader label. Season, date, weekday and temperature affect no fight rule today.
- **FTL4. At 1280 the line overflows.** It ends at "Fight in progress"; "Ready now", the next item and the save state are cut off. The line spends that width on facts that are frozen (clock) or say nothing about the fight (season, temperature), while "Fight in progress" points at the card you are looking at.

What the top line still owes a player mid-fight: the save state; the next planned item, which matters here ("next: Feed the Moonglow Gu", and the card says Moonblade will not cut until the Gu is fed); and the fact that the world is waiting, with how much held time is piling up. The reserve ("Green-copper primeval essence 44/44") already reads the live fight essence through `statusReserveWords`, and the Hero panel's Combat box shows "Essence 44" too, so one of the two is a duplicate.

Options:

| Option | What it looks like | Cost and conflicts |
| --- | --- | --- |
| **FTL5. The card owns the scene; the line goes quiet.** | The card header becomes one full line: the fight's place on the left, then the conditions that change the odds as chips on the right: "Daylight · Poor footing · Rain · Fog", each hover quoting its stumble cost ("Poor footing: +5% to stumble"). A small fight clock on the header's right edge counts beats in: "42 s in". By default, time of day joins as the light word it produces ("Dim" or "Dark" rather than "Day"). On the top line during a fight: place shows the fight's place (PS30), the date and time slot dims and reads "Held · 12 min kept", season and weather hide, the work slot "Fight in progress" hides, and the reserve, Today/next and save state stay. | Small: `setStatusText(name, text, {idle: true})` already dims a slot and `slot.hidden` hides one, so the top line change is a fight-open flag read by the slot owners. The header change is in the fold summary (`sum`) in `combat_situation_ui.js`. Rain and fog move from the fold to the header. No save change. |
| **FTL6. The line becomes the fight's line.** | While a fight is open, the status line's place and weather slots are handed the card's own nodes with `placeInStatus`: "A gap in the wall · Daylight · Poor footing · Rain · 42 s in · Held 12 min · Essence 44/44 · next: Feed the Moonglow Gu · Saved". The card drops its header row and gains a line for the roster (the OP goal of one page without scrolling). | Uses the spine's own mechanism (PS53), and keeps one home for where and when in every mode. But the conditions sit a screen-width away from the moves they change, the top line is already the row that overflows at 1280, and the header's empty right half goes unused. |
| **FTL7. Unusual: the scene shows itself, no words.** | No condition words. Light dims or warms the card's frame, rain draws faint streaks behind the roster, fog softens foe rows past the first, poor footing draws a broken ground line under the moves. Each move's stumble chance already in its hover carries the reasons. The top line hides everything except save state and a single "World waiting · 12 min held" chip. | Most immersive, least text. Readability depends on art that does not exist yet, and a cue drawn in colour alone broke the colour-with-words rule (since removed, 2026-11-21). Best as a later layer over FTL5, not a replacement. |

Per fact, under FTL5 (each a default with a dial):

- **FTL8. Chip forms.** Weibao's picture is the floor (UR177): the season keeps its green 夏 chip and the day phase its boxed chip, and the temperature stays an underlined link, outside fights. In a fight the season and temperature chips retire from the line, and the day phase reappears in the card header as the light chip it causes, same boxed form. A world whose fight rules read cold, heat or season (frostbite, a summer-only beast) brings that fact into the header as a chip with its stumble or harm quote; until a rule reads it, it stays off the card. The reserve keeps the top line copy, because it is the one the player sees outside the card while choosing to fight, and the Hero panel's Combat box drops its Essence row.
- **FTL9. Held time is the new fact.** "Held · 12 min kept" on the dimmed clock slot tells the player the world is not moving and that time will be spent after. It reads `b.held` plus the pending hold; nothing new is saved. The hover gives the cap (`heldCapMinutes`, a week).

Mock: built after Weibao asked "Show me FTL7 and FTL 5" (see the mock section below).

Recommendation: FTL5 with FTL8 and FTL9. It puts what the fight reads next to the moves it changes, fills the header's empty right half at 1920, and frees the top line at 1280 so the save state and next item show again. FTL6 was rejected because it moves conditions away from the moves and adds to the row that already overflows; FTL7 stays on file as a later art layer. Not decided.

### FTL5 and FTL7 mocked (2026-11-21)

Weibao: "Show me FTL7 and FTL 5". Built as one local mock branch, `mock/fight-scene-2026-11-21` in `~/code/yarpg-mock-fight-scene` (MW9), on a snapshot of the primary checkout's uncommitted work. The URL picks the variant (`?mock_ftl=5` or `?mock_ftl=7`); without it the game is today's. `?mock_scene=rain,fog,dark` is stub data that changes the drawn scene only, never the fight rules or the save. Captured from Fang Yuan's composed day (`ri-fang-yuan-wild-gu` plus a Moonglow Gu) opening the wolf pack at the gap, headless Chrome, fresh context per frame, zero page errors ([log](../../../representations/evidence/fight-scene-2026-11-21/capture.log)).

| | 1920 | 1280 |
| --- | --- | --- |
| Today | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-today-1920.png) | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-today-1280.png) |
| FTL5 | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-5-1920.png) | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-5-1280.png) |
| FTL5, stub dark, rain, fog | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-5r-1920.png) | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-5r-1280.png) |
| FTL7 | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-7-1920.png) | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-7-1280.png) |
| FTL7, stub dark, rain, fog | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-7r-1920.png) | [frame](../../../representations/evidence/fight-scene-2026-11-21/ftl-7r-1280.png) |

What the frames show:

- **FTL5.** The header reads "A gap in the wall" with boxed chips "Daylight · Poor footing" (and "Dark · Poor footing · Rain · Fog" with the stub) and "18 s in". The top line starts with the fight's place, dims the frozen date, adds "Clock held · 0 min kept", and drops season, weather and "Fight in progress". At 1280 the line still overflows (FTL12).
- **FTL7.** The header holds just the place. The top line is "A gap in the wall · World waiting · 0 min held · Saving available.", with nothing cut at either size. The card shows a warm daylight edge and a broken ground line for poor footing; the stub adds rain streaks. The dark vignette is faint and the fog dimming did not apply to the roster rows in this build, so FTL7 reads weaker than intended (FTL13).
- **Held time** reads 0 or 1 minute because each capture opened the fight seconds before the shot; it grows while the fight waits.

Not built: the hybrid (FTL14), the stumble figure (FTL11), the light from the clock (FTL10). Verification: browser frames only; no unit tests run on the mock branch.

### Rules a single player may not need (SPL1 to SPL12, 2026-11-21)

Weibao: "Remove "rule for colour always has words behind it," identify other rules that might be useless for u?" The colour rule is removed (UR37, UR102, UR108 and the principles line in `UI_RULES.md`; P7 and IM7 in `PRESENTATION_AND_FOURTH_WALL.md`; logged in [USER_VISION_LOG](../../USER_VISION_LOG_2026-11.md)). The candidates below were found by keyword search with line reads, not a full reading, and none is removed without his yes (AD56). Ranked by freedom gained.

| Code | Rule | Serves | Costs him | Proposal |
| --- | --- | --- | --- | --- |
| SPL1 | IM5 (PRESENTATION:2227) and the touch clause of UR43: every hover needs a tap twin | A phone player; the vision digest already defers mobile | A second path per hover | Drop the touch clauses; keep "not hover alone" for keyboard and agents (UR134) |
| SPL2 | UR33, UR39, UR100: layouts still work at 125% and 150% text | Readers who zoom | A 150% pass on every layout | Drop the 150% gate as a check; text size stays a dial (UR65) |
| SPL3 | UR170: a text size, contrast and reduced-motion settings page | Other viewers | A settings surface and CSS variants | Off-by-default dial |
| SPL4 | P7 and UR37's reduced motion, TX3's static twin for every effect | A general audience (WCAG 2.3.1 flash cap) | A static form for every effect | Keep the effects slider; drop mandatory static twins |
| SPL5 | UR14 and UR176: a first-time player must find the way back from a screenshot; a blind panel per wave | A stranger | A screenshot and panel per wave | Keep the screenshot with his own test ("can I find it"); drop the first-time framing |
| SPL6 | UR112 and UR5: confirm dialogs for costly actions, focus on the safe choice | A careless public player | A click per costly action | Confirms off by default; keep the guards on save import and replace (UR55) |
| SPL7 | IM6: a dyslexia-friendly option and typewriter text speed | Other readers | A variant path per text effect | Drop the dyslexia option; text speed becomes an off-by-default dial |
| SPL8 | Localisation notes (PRESENTATION:1365): case effects reskin for Chinese, right-to-left text | Future locales | Design time | Drop as a rule |
| SPL9 | UR73 and UR70: short plain explanations of what each subject changes | A new reader | Copy volume on every surface | A dial, default on for mechanics he has not met; exact numbers stay (UR161) |
| SPL10 | UR31: hotkeys printed in every navigation tooltip | A new player | Tooltip noise | Keep the "?" sheet; drop per-tooltip hotkey text |
| SPL11 | UR50: attribution needs a home in the chrome | Upstream credit | A small slot | Keep: AGENTS.md requires attribution and LICENSE |
| SPL12 | Labels, aria, real buttons, disabled reasons (UR121, UR122, UR128, UR130, UR134, UIV1, TX2, TX13) | Agents: `scripts/mcp/game_worker.mjs` finds controls by aria-label, role and aria-disabled; TX13 keeps sealed truths out of that text | Little | Keep. They look like accessibility rules, but they are how Game MCP and the tests see the game |

Recommendation: SPL1 to SPL8 and SPL10 are the safe cuts. SPL9 is a taste call. SPL11 and SPL12 stay. Not decided.

### The fight card: duplicate bars, the pack of five, consumables (FCD1 to FCD10, 2026-11-21)

Weibao: "is the current ui duplicating the Hp bar showing? should it just show all 5 of them at once? Better ways to showcase? Consumable usage? other general improvements apart form bugs??" Read from the master card at 1920 and 1280 (the crowd-front screenshots and the FTL mock captures).

- **FCD1. Yes, the front wolf is drawn twice.** The pack row's layered bar shows the front wolf's health, and the target slot under it shows the same wolf's full row with its own bar, and "Target" twice. The duplicate exists when the target is the front; once you pick a wolf behind, the slot is new information.
- **FCD2. Show all five at once, as one segmented bar.** One bar split into five segments, each with its own fill and letter, the front segment first and outlined. You see every wolf's health in one line. The NS build (NS2, branch `feat/packs-and-away-2026-11-21`) already draws this shape for packs; a crowd would use it with the front rule marked by order and an outline. The slot then appears just for a member behind the front, which is when its conditions and timer are worth a row.
- **FCD3. The stat line repeats.** "Atk looks stronger than you · Spd ? · Hit ? · Ddg ? · Def ?" is printed on the pack row and again on the slot, and it is the same for every wolf of one kind. Print it once, on the pack row.
- **FCD4. An empty line in the pack row.** The crowd row reserves a third line (under the ×5 bar) that holds nothing in this fight. Fold it until a member has a condition to show.
- **FCD5. The Moonblade reason is printed twice** ("The Moonglow Gu is hungry and will not cut. Feed it first." small, then again in yellow). Keep the yellow line.
- **FCD6. Consumables: the Items row says "Nothing ready · Open pack"** although the fix for the blocked power is an item: feeding the Moonglow Gu (two Moon Orchid petals; he has none). Proposed: the Items row lists the fight-relevant consumables as slots like the moves, each with a number key, a beat cost and a count ("Moon Orchid petal ×0 · feed the Gu · 3 beats"), blocked with the reason when you lack it. Food and pills that matter in a fight (stamina, a wound) join; the rest stay in the pack.
- **FCD7. Using a consumable is a move.** It costs beats and can be interrupted like any other, so the tempo bar shows its cost, and Fight on (CBD38) can use one when a rule allows (eat at low stamina).
- **FCD8. The space below the card is empty at 1920.** The card ends around y=490 of 1080. Options: taller bars with the trail and harm stripe readable at a glance, the last few fight lines inside the card (the Reports column already carries them, so this is a choice, not a fix), or leave the space for the stacked crowd at larger sizes.
- **FCD9. The Hero panel's Combat box repeats the card** ("Your turn · acts next", Essence 44, Moonglow Gu Hungry). With FTL5 the reserve stays in the top line; the Combat box can drop Essence and the Gu state, keeping the stance.
- **FCD10. Move cells use two lines for cost** ("3 beats · 1 of 40 / stamina"). One line ("3 beats · 1 stamina") lets the row stay one line at 1280.

Recommendation: FCD2 with FCD1 (the segmented bar, slot only for a member behind), FCD3 to FCD5 as cleanups in the same pass, and FCD6 with FCD7 as the consumable slice. FCD8 to FCD10 after the bar change, since they depend on how much height it frees. Not decided.

### More to consider on the fight top line and card (FTL10 to FTL16, 2026-11-21)

Weibao: "MOre to consider?" Focused on FTL5 and FTL7 first, then the card around them.

- **FTL10. ACCOUNT FOR NOW: the fight's light ignores the clock.** Openers hard-code light (`src/tempo_lead_fights.js`: the wolf pack at the gap is always `light: 'day'`; the patrol picks dark). A pack fight at 22:00 would still read Daylight, so FTL5's "the day phase comes back as the light it causes" would show a contradiction. Default: an outdoor fight takes its light from the world's sky phase when it opens (night is dark, dawn and dusk are dim); a place that sets its own light (a cave, a lit hall) keeps it. Dial per opener; mechanism change, no save change (conditions are already on the saved fight).
- **FTL11. ACCOUNT FOR NOW: one stumble number beats four chips.** `mishapChance` adds stamina, pain, an unfamiliar tool and the scene terms. The chips quote just the scene part. A header figure "Stumble 10%" with the breakdown in its hover tells the player the thing they act on; the chips stay as the reasons. Read from the same function the rules use, so it cannot drift.
- **FTL12. ACCOUNT FOR NOW: FTL5 alone does not fit 1280.** The mock capture at 1280 still cuts off the save state, because "Today: nothing planned · next: Feed the Moonglow Gu (needs 2 Moon Orchid petals; you have 0)" is long. The top line also says the next item twice. In the FTL5 capture, "Today: … next: Feed the Moonglow Gu" and the pinned band's "Ready now · 3 close · Feed the Moonglow Gu" sit side by side. In a fight, keep one (the band's, since it is clickable).
- **FTL13. ACCOUNT FOR NOW: FTL7 is faint at 1280.** The daylight edge and the ground line read as decoration, not information. With colour now allowed to carry meaning alone, FTL7 can use stronger, role-coded tints (a red-brown ground line for poor footing, a cold blue cast for night) and still stay wordless.
- **FTL14. LATER: a hybrid.** FTL5's header (place, stumble figure, fight clock) with FTL7's drawn scene behind the card. The words answer "how much", the drawing answers "what kind of place". Build after a choice between the two, on the same mock branch.
- **FTL15. LATER: held time after the fight.** The held minutes play out at up to 60 a tick after settlement (`clock_owner.js`, `heldStep`), so the world catches up over the next few seconds. A one-line Reports entry ("The world caught up: 12 min") would close the loop FTL9 opens.
- **FTL16. LATER: the frozen date.** In FTL5 the dimmed date still takes width at 1280. It can move to the held chip's hover ("Held at 06:00, 12 March").

### The empty slot and auto attacks (SLT1 to SLT3, AUT1 to AUT9, 2026-11-21)

Weibao, looking at the layered-bar mock (`mock/fight-card-2026-11-21`, commit `2fc13842a`): "I not sure what the empty slot under bar means, also, consider what it takes for auto attacks and more? more to consider? Best way to go about this?"

**The slot.** The target slot is the blank strip between the wolf-pack bar and the Body row, about 54 px tall in `fcd-open-1920.png`.

- It fills only when you pick a wolf behind the front, for example C, and then reads "Lightning wolf C · Behind the front" with C's own bar.
- When you target the front wolf, the slot stays empty but keeps its height, so the move buttons don't jump when you change picks (MT1).
- The layered bar gives no reason to keep it. A wolf behind the front can't be hit until Single out, so its full row is mostly a status line.

| Code | Option | Cost |
| --- | --- | --- |
| SLT1 | Keep the empty strip. | It looks like a bug, as this question shows. |
| SLT2 | Collapse the strip when it's empty. | The moves shift by a row whenever you pick a wolf behind the front. |
| SLT3 (recommended) | Drop the slot for crowds. The picked letter stays highlighted and the name line adds "C behind the front · Single out to reach" (C's health is in the letter's hover). A target outside a crowd still uses its own row. | It loses C's separate bar, which mostly duplicated a layer. |

**Auto attacks.** Most of this already exists, so the work is in how it feels, not in new rules.

- **AUT1. Facts.**
  - Fight on (`run()` in `src/tempo_fight_domain.js`, CBD38 and CBD56) already plays your turns with the steady policy, attacks and kit included.
  - It stops at a downed body, your losing terms, a new injury, health under half (`RUN_FLOOR` 0.5) or a changed situation (`askNow`).
  - One click takes at most 12 turns (`RUN_CAP`), all resolved at once. The card then jumps to the result.
  - `driveTempoFight` already settles a whole fight headless.
  - What is missing is visible, ongoing auto play.
- **AUT2 (recommended). Fight on plays out at a pace.** One turn per beat tick, about 1 s, instead of 12 turns at once.
  - The bar drains as you watch.
  - Any move you click takes the next turn, then auto play resumes. A Pause or Take over button stops it.
  - The stop rules stay as they are. Each turn already commits through the normal move path, so save, reload and export need no new state beyond "auto on", which could be a session flag that is not saved.
  - This is the idle-RPG feel with the tempo rules kept.
- **AUT3. Auto on by default for routine fights (CBD56).** Opening a fight starts auto play. The card asks only when a stop rule fires. Needs AUT2 first.
- **AUT4 (unusual). The fight card shrinks to a ticker.** A routine fight shows as one line in the status bar ("Wolf pack ×3 · you 41/60 · auto") and opens the full card when a stop rule fires. This is closest to the original idle game and frees the screen, but it hides the drawn fight most of the time.
- **AUT5. ACCOUNT FOR NOW: spending stock.** Auto play already feeds the Gu (dial `useToUnblock`). Once there are healing pills, auto play needs a spend rule, such as "use a pill under a third of health, keep the last one" (CBR26 pays from real stock), or it will burn rare items. Policies grown from answers (CBD59) are the long-term owner.
- **AUT6. ACCOUNT FOR NOW: crowds.** The policy hits the front and does not use Single out (`target()` hits the front). That is fine for wolves. A crowd with a dangerous member behind the front needs a "kill the healer first" order, which belongs to CBD59 standing orders.
- **AUT7. ACCOUNT FOR NOW: Reports spam.** Twelve turns write about 50 lines. Auto turns could fold into one line per round ("Round 3: you hit A for 4; B and D hit you for 9"), with the full lines a click away.
- **AUT8. ACCOUNT FOR NOW: the world clock.** The clock is held during a fight. A paced auto fight lasts real seconds, so the time held stays the fight's own seconds, as now. If the player leaves mid-fight, nothing advances. Away time should not run a fight unattended unless AUT3 is on.
- **AUT9. LATER: agents and tests.** Game MCP reads buttons by aria-label, so the Pause control needs a stable label, and a paced run needs a test hook to step it without real waits.

**Best way to go about it.**

1. Pick SLT3 on the mock branch (small).
2. Build AUT2 on the same mock branch, with frames and a short screen video.
3. Decide AUT3 and AUT4 after playing AUT2, since how it feels is the question.

AUT5 to AUT7 are the constraints to keep while building. None needs a save change.

### A fresh look at the fight card, with Arkivia's fight (FRS1 to FRS14, 2026-11-21)

Weibao, on SLT and AUT above: "consider the other options and more? other stuff? Use a fresh perspective for the Combat ui too? considerations from https://just-pointless.github.io/arkivia/ and more?"

**Evidence.** I ran Arkivia v0.26.1 headless and started a fight with its own `generateEnemy('mouse')` after the intro: [arkivia-fight-1920.png](../../../representations/evidence/fight-scene-2026-11-21/arkivia-fight-1920.png). I also read its source (`game.js` `processPlayerTurn`, `processEnemyTurn`, the combat block in `tick()`, and `index.html` `#attack-info`). This builds on AK1 to AK15 and the source read above, which covered the damage trail, speed order, the hidden stat total and stacked log lines. It adds what the fight itself shows.

**What Arkivia's fight does.**

- **FRS1. Combat is fully automatic, one exchange per game tick.** The faster side strikes first, then the other answers. There are no moves to pick: the choices in a fight are made before it (gear, training, which scene) and through items clicked in the inventory.
- **FRS2. The fight stays out of the stage.** It sits in the top band, laid out left to right: your bars, your four stats, the foe's name and HP bar, the foe's effects, then its four stats (with a debuff shown inline, such as "Def: 1 (−20%)"). The scene prose and its choices stay in the centre the whole time. Your stats and the foe's sit in the same order, so you compare them by eye.
- **FRS3. The log is terse.** Each line is "You -> 4" (damage in red), "Mouse missed", "Mouse -> 1". It reads well even while turns arrive every second.
- **FRS4. Time runs during a fight.** Each turn costs a minute of game time and some energy. Nothing is held.

**Our card, read fresh.** Read as a first-time player, the frames (`fcd-open-1920.png`, `fcd-moonblade-1920.png`) show this:

- **FRS5. About fourteen buttons ask for a decision every turn.** The rows are six body moves, two powers, Items with Pack, and six terms. Most turns the right answer is the same strike. Arkivia shows that zero choices per turn can still be fun when preparation matters.
- **FRS6. The stage is the fight.** The place, its prose and its choices disappear while the card is open, so a wolf fight feels like a different game from the day around it. This is the same complaint as FTL1 to FTL9 (time and place belong to the fight area), seen from the other side.
- **FRS7. The same news shows three times.** The latest hit appears as the card's top line, in Reports, and on the bars.
- **FRS8. Beats are words.** "3 beats" and "6 beats" are our distinct mechanic (tempo), yet nothing shows when each side will act next. The foe's tick on the timing bar is the one hint.

**Options for the card (pick one direction; each is a real-game mock under MW9).**

| Code | Direction | What it changes | Cost |
| --- | --- | --- | --- |
| FRS9 | Paced auto on the current card (AUT2 with SLT3). | Fight on plays one turn per second, and your clicks cut in. | Smallest change. It keeps the fourteen-button wall. |
| FRS10 (recommended) | **Auto by default with interrupts.** The card opens running the steady policy at a pace. The moves fold into one strip of interrupts: the default strike, Single out, powers, items and Back away, with the other terms behind "More". Stop rules (AUT1) pause it and open the full move list with the reason. | It answers FRS5 and FRS7 and keeps tempo choices for the turns where they matter. It is CBD38 and CBD56 made visible. | Needs a Pause control, AUT5's spend rule before pills exist, and AUT7's round lines. No save change. |
| FRS11 | **Arkivia band.** The fight moves into a band across the top of the centre column: you on the left, foes on the right, compared row by row. The scene stays readable below. | It answers FRS6, and FTL5 becomes natural (place and weather sit in the band's header). | A pack of five needs the layered bar to fit in one band row. Moves have to live in the band or behind it. Bigger layout work. |
| FRS12 (unusual) | **A beat timeline.** One horizontal track of the next beats: your marker and each foe's marker sit where they will act, and hovering a move shows where it would put you ("Heavy swing: you act after B and C"). | It turns tempo into the thing you look at, and makes Brace against a 6-beat swing an obvious read. Nothing in Arkivia or proto23 does this. | Needs the engine to quote future turn order (`nextActor` gives just the next turn). This is the most design work, and it suits players who like reading fights more than watching them. |

**More to consider.**

- **FRS13. ACCOUNT FOR NOW.** Whichever direction wins:
  - Keep the aria-labels and roles (Game MCP reads them).
  - Keep numbers hidden behind sense words (PS236, AK10 rejected).
  - Keep the layered crowd bar.
  - Keep the hero's HP on the left panel alone (FCD).
- **FRS14. LATER, from Arkivia.**
  - Fight achievements ("won without being hit", "won under 5% health") fit the deeds list cheaply.
  - Equipment that wears down per hit gives stock a combat cost without a new mechanic.

**Best way.**

1. Build FRS10 and FRS11 as two flags on the mock branch, the way FTL5 and FTL7 were built.
2. Capture the same wolf-pack moments at 1920 and 1280 side by side, and let Weibao pick.
3. Hold FRS12 until one of those has been played, since it is the most design work.

**Mocked (2026-11-21).** After "Yes, mock both", FRS10 and FRS11 were built behind `?mock_frs=10` and `?mock_frs=11` on `mock/fight-card-2026-11-21` (commit `56cc1b6f0`). The frames and the receipt are in `docs/representations/evidence/fight-card-frs-2026-11-21/` on that branch. There were 0 page errors at 1920 and 1280.

- Auto play fed the Gu, threw Moonblade, then paused itself at "You have taken a new injury" about 3 turns in. Against a pack, the stop rules fire too often for auto to feel idle (CBD56 needs a sense of what this fight is expected to cost).
- FRS11's scene below is thin at the academy (two collapsed groups). The band also keeps the card's vertical layout.

**FRS10 taken forward (2026-11-22, Weibao: "Do what's best").** Paced auto now pauses when the fight goes worse than expected, not at every hit. It pauses for a wound or worse, for health under a quarter, or when you are losing the race against the foes' remaining health. The run with the wolf pack paused twice, both times meaningfully: at 2 s "you are losing faster than they are", then at 9 s for health under a quarter. Fang Yuan is outclassed there. The run with a single wolf killed it with no pause. Evidence is in `fight-card-frs-2026-11-21/full-run/` on the mock branch. Open dials: the floor (the single wolf took him to about a third of his health without asking), and whether AUT3 (auto on by default for routine fights) should be next.

### When you go down, and which computed reasons to say (DWN1 to DWN12, 2026-11-22)

Weibao, with a picture of Arkivia's training loop (auto fights, a Stop button, "Straw Dummy died", "+4 XP"): "We need to improve the death screen somhow, how does other games cover it? Some info like 'his is going worse than expected: you are losing faster than they are.' can be calculated, but then we dont necissarily need to show it or tell it to the player?"

**What we have now.** From the mock run's last frame, `full-run/frs10-end-1920.png` on `mock/fight-card-2026-11-21`, and from the code:

- **DWN1. The engine already knows the story.**
  - The other side's terms (`THEIR_TERMS` in `src/fight_terms.js`: rob, spare, capture, leave for dead) each carry a waking line, such as "It mauls you and leaves you for dead. You wake badly hurt."
  - A loss also publishes a defeat record (`savedBattleLoss`, outcome "unconscious") and sets the day extension's injured fact.
- **DWN2. The screen does not tell that story.** The card shrinks to one line, "A wolf pack at the gap. You: out cold.", over one wolf's bar, with a back button. The waking line, how long he was out, where he is and what to do now appear nowhere on it. The account sits in Reports. Arkivia does even less: you wake at home with 1 HP and half your energy gone, and the log says "You died!".
- **DWN3. ACT NOW (defects seen in that frame).**
  - The account reads "Hurt: Health 1 of 41.6" while the bar shows 3/60.
  - The settled card drops the pack's layered bar for a single "Lightning wolf A" row.
  - The back button read "← Back to Your beginning", because the capture opened Beginning first. Check whether a player's route gets a sensible label.

**How other games handle it.** Arkivia comes from its source. The rest is from memory and was not rechecked this session.

| Code | Game | What happens when you lose | For us |
| --- | --- | --- | --- |
| DWN4a | Arkivia | You wake at home, or at the Hunters' guild in the forest, with 1 HP and half your energy lost. Effects clear and the tab title reads "DEAD". | A soft death that costs little. Fine for an idle loop, but flat. |
| DWN4b | Stardew Valley | Passing out in the mines: you wake at the clinic, some money and items are gone, and the doctor's note says who found you. | A life sim's answer: someone brought you somewhere, and the loss is concrete. |
| DWN4c | Kenshi | Knocked out, not dead. The winners may loot you or enslave you, and you wake where you fell, bleeding, with the fight's consequences in place. | Matches our "their terms" closely. |
| DWN4d | Hades | Death is a story beat. You return home, people comment on how you died, and progress carries over. | Defeat as content, not a penalty screen. |
| DWN4e | Darkest Dungeon, NetHack | A memorial: "killed by a jackal on level 3", with the hero's record. | For true death (RL5's life summary), not for a knock-out. |
| DWN4f | Dark Souls | "YOU DIED", then a chance to recover what you dropped. | A recovery hook: the wolves' gap still holds your dropped things. |

**Options for the knock-out screen** (true death stays with RL5):

- **DWN5 (recommended). A waking scene.** The card turns into a scene. Built from DWN1's facts, it has:
  - the place and how long you were out (the clock moves);
  - what they did (their terms' line);
  - what it cost (wounds by name, things taken);
  - one or two things to do next (rest, see a healer, go back).
  - One hindsight line, "Five wolves were more than a rank-one aperture could hold", which is where the computed comparison earns its place.

  This takes from Stardew and Kenshi, and no save change is needed beyond the clock advance the defeat record already implies.
- **DWN6. A recap of the fight.** Hades and Spelunky style: who did what to whom, the turn the fight tipped, and what to try next time. It is useful for tuning, but it reads like a report, and Reports already holds the lines.
- **DWN7 (unusual). Someone finds you.** Who wakes you depends on who was near: a clan elder, Fang Yuan's brother or a passing hunter. Each costs a favour, wins sympathy or starts a rumour. Defeat then feeds the people systems (relationships, reputation) instead of a menu. It needs a "who is nearby" read, which the presence work may already have.

**Computed but not said (DWN8 to DWN11).** Weibao's point holds. The engine can compute who is winning the race and still not narrate it.

- **DWN8. Three ways to voice a pause.**
  - Silent: auto just stops and the card says "Your turn".
  - In the fiction: "Your breath is ragged; the pack is still fresh", built from the same numbers through sense words, as foes are already described (PS236).
  - Analytic: the sentence the mock prints now.
- **DWN9 (recommended).** Voice the pause in the fiction, and save the analysis for hindsight: on the waking scene, and on hover over the pause line. That keeps the meta-game quiet during play and honest afterwards.
- **DWN10. Use the calculation without telling.**
  - Losing terms ("break off at a third") can act on it.
  - Before the fight, the opener can show a sense read, "This looks like more than you can hold".
  - This pre-fight read is the most useful place for it, since it changes a choice the player still has (Arkivia shows stat totals there; we keep words).
- **DWN11. ACCOUNT FOR NOW.** Agents read the pause's role and label (Game MCP), so a fiction line still needs a stable `data-` reason key for tools and tests.
- **DWN12. LATER.** Arkivia's training loop (fight, "+4 XP", repeat, Stop) is the idle shape for drills. A drill against a dummy should run as one repeating row with a Stop button and a stacked log ("Straw Dummy died ×12"; AK12 stacking), not a fight card each time.

### The kill and what comes after (KIL1 to KIL12, 2026-11-22)

Weibao: "I meant also improve the killing enemy scene, doesnt it jump straight until the next part? more to consider?"

**What a win shows now.** Source: `full-run/tide-frs10-end-1920.png` on `mock/fight-card-2026-11-21`, Fang Yuan killing one lightning wolf under paced auto.

- **KIL1. Yes, it jumps.** The killing blow settles the fight in the same turn, and the card goes straight to its end state:
  - the name with "Dead" stuck to it ("A lightning wolfDead");
  - an empty bar over a large empty box;
  - one sentence: "A lightning wolf beyond the wall. You: standing. A wolf eye for the board, its hide and 6 jin of meat are in your pack.";
  - a back button.

  The blow itself is never on screen. In a pack, a dead wolf's letter is struck through and the next wolf takes the front with no pause.
- **KIL2. ACT NOW: the lines read backwards.** Reports has "You finish it, as you meant to." before "You use Moonblade on A lightning wolf: it lands, for 10." and then "A lightning wolf is dead." The player's terms (`src/tempo_fight.js`, the "as you meant to" lines) are said before the blow that downed the wolf.
- **KIL3. ACT NOW: the numbers disagree.**
  - The account says "Hurt: Health 38.5 of 56" while the hero bar reads 41/60, the same mismatch as DWN3.
  - Hero XP stays 0/10, and nothing says whether a kill teaches anything (no skill line).
- **KIL4. The spoils are one clause.** The eye, the hide and the meat arrive in the middle of a sentence. Arkivia gives each its own line ("Obtained x1 Strand of Straw", "+4 XP"), which the feel pass already adopted as a plus sign on gains.

**How other games mark the kill.** Arkivia comes from its source and the picture. The rest is from memory and was not rechecked this session.

| Code | Game | The kill moment | For us |
| --- | --- | --- | --- |
| KIL5a | Arkivia | "Straw Dummy died", then each item and the XP on its own line. In a drill the next dummy starts at once, until Stop. | The repeat loop for routine work (DWN12). |
| KIL5b | Monster Hunter | After the kill you carve the body by hand for a few seconds, and each carve rolls a part. | Fang Yuan cuts the wolf himself, so the carcass is a scene, not an auto-loot. |
| KIL5c | Red Dead Redemption 2 | Skinning takes time, and pelt quality depends on how you killed (the right weapon and a clean shot give a perfect pelt). | Moonblade's cut versus a fist could change the hide's worth. |
| KIL5d | Darkest Dungeon | Corpses stay in the enemy ranks and must be cleared before the back row can be reached. | A crowd's dead could block the gap for a turn. |
| KIL5e | Souls games | A boss earns a banner ("Victory Achieved"); ordinary foes just fall. | Mark big kills, and keep ordinary ones quick. |
| KIL5f | Pokémon | "Fainted", then the XP bar fills on screen. | Show what was learned, not just what was taken. |

**Options.**

- **KIL6 (recommended). A beat and a tally.**
  - **The kill gets a hold of about a second.** The killing blow's line is shown large on the card, the bar drains with its damage trail, and the name is struck through. Paced auto waits one extra tick after any kill, a pack kill included.
  - **The end card becomes a tally:** each gain on its own line with a plus sign (the eye, the hide, the meat, any skill learned), what it cost (health, stamina, essence, petals), and the next things to do in place: hunt again, rest, carry it home.

  It needs no save change.
- **KIL7 (unusual). The carcass is a scene.** After the kill, choose how to take it: cut carefully (more time, better hide, the risk that more wolves come) or grab the eye and go. How you killed it sets what is left, so Moonblade's cut spoils part of the hide. Fang Yuan's world is about selling wolf parts, so the choice carries weight. It needs authored rows and part quality, and it is the most design work.
- **KIL8. Routine kills loop.** A hunt you have done before runs Arkivia's way: kill, tally line, next wolf, until Stop or a pause rule. The card shows a running count ("Wolves ×4 · hides 3 · eyes 4"). Pairs with AUT3 and DWN12.

**More to consider.**

- **KIL9. ACCOUNT FOR NOW: a pack's dead.** When a wolf in the pack dies, the gain should land then ("+1 hide"), not all at the end. Whether the dead body holds the gap for a turn (KIL5d) is a tactics choice for the crowd rules (MS2), not a UI choice.
- **KIL10. ACCOUNT FOR NOW: the kill is a fact others see.** Witness and memory effects already fire on a strike (`witnessEffect`). The tally could name who saw it ("The patrol saw the kill"), which ties KIL to DWN7's people.
- **KIL11. ACCOUNT FOR NOW: computed, not said (DWN9).** The kill's hindsight ("Moonblade did most of it") belongs on the tally, not in the fight.
- **KIL12. LATER: first kills are deeds.** The first kill of a kind is a Deeds line, and it teaches the bestiary (the met-foes list already exists).

### Too much realism? Text games first (TXG1 to TXG8, 2026-11-22)

Weibao: "fix then mock? Are we doing too much realism for a game that quite doesnt need it? SHould we be comparing/inspired from other text based games first?"

**TXG1. Partly yes.** The vision asks for deep systems and "whimsical and unpretentious" UI and prose, with depth that avoids micromanagement ([vision digest](../../../VISION_DIGEST.md)). Several recent ideas spend that on ceremony, not on systems:

- KIL7, carving the carcass by hand;
- KIL5c, pelt quality set by the killing blow;
- KIL5d, corpses that block ranks;
- DWN7's who-finds-you roll.

They add steps the player watches, not choices that change a life. Keep realism where it already lives in systems and pays off later: what the winners took, wounds by name, who saw it, the price of the parts. Cut it where it is a step to sit through.

**TXG2. Yes, text games are the right first comparison.** Our surface is a card of words and a log, so a 3D game's kill camera or carving animation does not translate. Text games solved the same problem with lines. The rows below are from memory, not rechecked this session.

| Code | Game | A win | A loss | What to take |
| --- | --- | --- | --- | --- |
| TXG3 | Kingdom of Loathing | "You win the fight!", then one line per gain ("You acquire an item: …", "You gain 4 Strengthliness"), every line a joke. | "You lose. You slink away, dejected and defeated", plus a Beaten Up effect that costs turns. | One signed line per gain. Defeat as a status effect that heals with time. Humour in the lines, which matches "whimsical". |
| TXG4 | Fallen London | No combat. A challenge succeeds or fails with a short paragraph, and the qualities that changed are listed underneath. | Failure raises a menace (Wounds). When it is full you are sent to a place (the Tomb-Colonies) and must play your way back. | Defeat is a place with a way out, not a screen. Changes are listed under the prose. |
| TXG5 | A Dark Room | Weapon buttons on cooldown bars. On a win a loot box lists the items, with take buttons. | You go back to the village and lose what you carried. | Loot is a short list you act on. |
| TXG6 | Torn | Win, mug or hospitalise the other player. | Hospital for a set time. | Defeat costs time, which an idle game can show plainly. |
| TXG7 | MUDs | "X is DEAD!", a corpse to loot. | Your corpse holds your things and you run back for them. | Fine for a later recovery hook. |
| TXG8 | Arkivia, proto23 | Log lines ("Straw Dummy died", "Obtained x1", "+4 XP"), and the next fight starts at once. | You wake at home with 1 HP and half your energy gone. | Already AK, FRS and DWN. |

**What changes in the plan.**

- **KIL6 and DWN5 become text-game results.** Each is a head line ("A lightning wolf is dead." or "You go down."), the last blow, then signed lines for each gain and cost, then one hindsight line. They lose the panels. This is built as the mock below.
- **KIL7 and DWN7 move to LATER,** and stay there unless a world makes them matter.
- **A defeat state that heals with time** (Kingdom of Loathing's Beaten Up, Torn's hospital) is a light alternative to a waking scene for routine losses. The day extension's injured fact is already that state, so it needs just a name and a visible timer.

### How the fight ends: what YAIR and Proto23 do, and where (END1 to END11, 2026-11-22)

Weibao, with two frames of the text-game end screens (KIL6, DWN5 mock): "how does getting defeated show up in Proto or Yair? I wake up back in room? ... map and location data should be on top or next to the combat ... Lots of useless text from the results, and might be able to put those text in the report section instead? or we can reorg panels ... Consider how to make more use of hovering and colors and more?" Prose rules are another chat's; this section covers the end of a fight, its placement, colour and hover.

**What the references do.** These are read from upstream YAIR's code and a Proto23 `index.html` snapshot. They are shown in code, not taken from notes.

| | YAIR | Proto23 |
| --- | --- | --- |
| Kill | One log line, "X was defeated", green and bold. The foe's portrait dims to 30%; no screen, no popup | One log line, "X died", in burlywood, then "EXP: +N" in pink and coins in their metal colours. "Area cleared" in orange |
| Loot | "Looted X x N" in gold, in the Loot group; an option merges a run into one growing line | "New item obtained" in cyan, with the name in coral and the count in lime; the item card shows on hover |
| Defeat | "Hero has lost consciousness", red and bold, in the log. You are moved to the last bed you slept in and fall asleep (option on by default). Recovering: 20% XP for a while | No line at the moment of death. You arrive at "Your Home, Bed" with "You passed out..." as the scene text and a "Get up" choice. Energy is cut, effects are cleared, and you get a Death Badge ("Awarded by fate for dying"). The cause of death is kept in Statistics |
| Where | Everything goes in the log on the right, with filter buttons by group | Everything goes in the log; the location panel carries the waking scene |
| Hover and colour | A colour per line type (your hits light blue, hits on you red, crits brighter); no hover in the fight | Every line can take a hover. Damage type, crit and body part are separate coloured pieces. The monster panel shakes on a crit |

Both answer the question: yes, you wake in your room. Neither has a results screen. The fight's words live in the log, coloured by kind, and the place panel tells you where you woke. OOPS's native fights already keep YAIR's return to bed (`src/main.js:4955`); the tempo fight in the frames does not, so it sits on a result card with a back button.

**What the frames show (ACT NOW).**
- **END1. The numbers disagree.** These are defects, not wording; this is KIL3 again, on more surfaces. On defeat, the hero panel says 3/60 hp and 42/42 stamina while the result says "Health down to 1 of 41.6" and "Stamina 1 of 41.7". On the kill, it is 41/60 against "38.5 of 56".
- **END2. A dead foe's bar reads as full.** It is a solid dark red strip the width of the card. Draw it empty or dimmed, with the name dimmed, as YAIR dims the portrait.

**Proposals.**
- **END3 (recommended). No result screen; the card hands back to the place.** When the fight ends, the centre returns to the place view, as both references do. It shows one result banner at the top: the verdict line plus coloured gain and cost chips ("+ eye", "+ hide", "+ meat ×6", "− stamina 20"). Hover on the verdict gives the last blow and the hindsight line ("Moonblade did most of it"). This removes the back button, the empty half of the centre and the third copy of the same facts.
- **END4 (recommended). On defeat, wake where you sleep.** Use YAIR's rule (last bed) for tempo fights too. The place view carries Proto23's waking scene: "You passed out..." rewritten in the world's voice, how long you were out, and a "Get up" choice. This is DWN5 placed in the place panel, not on the fight card.
- **END5. Reports keeps the account; the card keeps none of it.** The blow-by-blow is already in Reports. The closing summary paragraph there ("You: out cold. Them: ... Spent: ... Hurt: ...") repeats what the lines just said, so cut it to the verdict line alone. Its hover holds the totals.
- **END6. Colour by kind in Reports, YAIR's mapping with Proto23's pieces.** Your hits light blue, hits on you red, crits bold. Loot gold. XP or growth pink. A kill green and bold, a defeat red and bold. Body part and damage type are their own coloured pieces inside the line (Proto23). It runs through the existing `log_message` types and the filter buttons, so filters keep working (YAIR's hide-not-drop).
- **END7. Hover on every combat line** (Proto23's `msg(..., desc)`).
  - A hit shows its breakdown (roll, armour, body part).
  - A loot line shows the item card.
  - A kill shows the foe's bestiary entry.
  - A defeat shows the cause and what it cost.
  - The text stays short because the detail moved to hover.
- **END8. Place and map sit with the fight.** The card header already carries place, light and footing (FTL5). Add the place's small map or route strip above the card, so you can see where the fight is and where the way home goes. Desktop has the width; at 1280 the strip folds to the header line.
- **END9. Kill feedback on the foe, not in words.** The struck foe's row shakes briefly on a crit or kill (Proto23), and a gain chip floats from the dead foe toward the pack. Motion stays inside the fight's own box (UR146 as loosened).
- **END10 (unusual). Death leaves a mark.** Keep Proto23's cause-of-death record ("Mauled at the gap by a wolf pack") as a Deeds line and a count, with a dry joke badge on the first death. Defeat then feeds the life record, not a menu.
- **END11. LATER: routine kills condense.** YAIR's dynamic loot line: one growing line per hunt ("Looted hide ×3 (+1)"). This pairs with KIL8's running count.

Recommendation: END1 and END2 now, as defects, then END3 to END7 as one change. END8 to END10 follow once END3 lands. Not decided. The fight card files belong to the fight-card session; Reports colour and hover touch `src/display.js`, a shared file.

### The Here panel, and a more colourful Reports (HR1 to HR6, RC1 to RC8, 2026-11-22)

Weibao, with a picture of Here under the darker Graphite: "the Here area can be really improved, How does the other variations do it an what would suit us the best?", then "Making the reports section more colorful and more?"

**What the picture shows.**
- Two headers stack up: "Here" over "Village board".
- Each row is a box inside a box, with its button in a separate column that floats at mid-height.
- The two columns have uneven lengths, so a large hole opens under People.
- Descriptions wrap to three lines.
- A person, the Waypost supply clerk, sits under Things with no verb.
- Counts ("· 2") tell nothing the list doesn't.

**How the others do a place.**
- **YAIR:** the place name and a short description, then one column of full-width buttons whose label is the verb ("Talk to the elder", "Go to …"). Descriptions are in hover.
- **Proto23:** the location panel is text, with choices as coloured link lines ("=> …", "<= Get up"). Detail is on hover.
- **Arkivia:** the scene prose carries its choices inline as blue links, numbered for the keyboard (AK19). A way out shows its distance.
- **Our own variants:**
  - the Spacing row style, which gives one-line rows;
  - the areas mock (`prototypes/areas-2026-11-15`), with neighbour arrows on the place box's edges and a Move around list;
  - VI1, the centre as a stage.

**Here.**
- **HR1 (recommended). One column of verb-first rows, YAIR's form in Graphite.**
  - The rows read "Talk · Old Hesk, the village elder", "Open · Homes" and "Go · Wild willow stand · 5 min".
  - The whole row is the control: no separate button column, no box in a box, one hairline between rows.
  - The description moves to the hover (UR178).
  - Groups are thin labels, People, Things, Ways out, with no counts.
  - One column means no hole. It reads the same at 1280.
- **HR2. Arkivia's stage.** The place prose carries people and things as inline links, and ways out sit at the bottom with their time, numbered for keys. This is VI1 and AK19. It is the strongest identity piece, and it needs prose for every place.
- **HR3. Tiles.** A grid of small cards (glyph and name), with detail on hover. Dense and quick to scan, but abstract, and it hides the verbs.
- **HR4 (unusual). The place as a small map.** People and stations sit where they are, ways out on the edges, as the areas mock drew them. It pairs with END8 (a map beside a fight) and with the areas work (PS172 onward).
- **HR5. ACT NOW, whichever is chosen:**
  - one header, not two;
  - a person under Things moves to People with "Talk";
  - a second line only when it adds something (UR178).
- **HR6. Glyphs per kind (VI3).** A person, a station, a way out and a danger each carry one glyph in one colour role, so the list scans by colour before words.

Recommendation: HR1 with HR5 and HR6 now. HR4 later, as the place's signature, once areas land.

**Reports.**
- **RC1 (recommended). Colour by kind for every report, not only fights.**
  - This extends END6 (built on the fight-card branch).
  - Growth and XP in green, loot and money in gold, people in cyan, story in violet, danger in red.
  - Routine and time lines are muted grey.
- **RC2 (recommended). A coloured left edge per kind.** The uniform white rule becomes a 3 px edge in the kind's colour, so a long feed scans by colour.
- **RC3 (recommended). The filter buttons become the legend.** Growth, Loot, Combat and the rest each take their kind's colour, so the filters explain the colours. Today they are all pale lavender.
- **RC4. Lead with the number,** as Arkivia does: "+5 XP Breathing", "−4 hp, wolf (arm)", with the number coloured and first.
- **RC5. Hover on every line.** This generalises END7: the item card, the person card, the place.
- **RC6. Repeats stack** into "×12" (AK12), so idle play doesn't flood the feed.
- **RC7. Day headers become a band** with the season glyph ("秋 8 October"), so days separate at a glance.
- **RC8 (unusual). Names are links.** A person, item or place in a line opens its card. Reports then becomes a way back into the game, not a transcript.

- **RC9. Colour the words inside a line, not only the line.**
  - Weibao: "we can also choose specific text to have different colors and more?"
  - Proto23 does this: the damage number, body part, damage type and item name are each their own coloured piece.
  - For us, colour is set by what the word is, so it holds everywhere (Reports, Here, scene prose and hovers):
    - items by rarity;
    - people in cyan, places in teal;
    - numbers by sign: + green, − red;
    - damage and element types in their own colours;
    - money in gold, time in grey.
  - It comes from data the line already carries (subjects, items, amounts), not from guessing at words, so a name that matches a common word is never coloured by accident.
- **RC10 (unusual). Your own highlights.** A MUD client's highlight rules: in Settings you pick a word or name and a colour ("Fang Yuan" in gold, "wolf" in red), and Reports colours it wherever it appears. It is the player's own colour grammar, kept with the look profile.

Built as sent (Weibao, 2026-11-22: "send all of them"):
- HR1 with HR5 and HR6 as the default.
- HR2 to HR4 as switchable variants to compare.
- RC1 to RC10 on the fight-card branch.

Recommendation: RC1 to RC3 together, which is one change through the `log_message` types and the filter buttons. Then RC4 and RC6. The fight-card branch already types fight lines by kind (END6), so build on it rather than beside it. `src/display.js` is a shared file. Not decided.
