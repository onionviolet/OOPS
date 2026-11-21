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
