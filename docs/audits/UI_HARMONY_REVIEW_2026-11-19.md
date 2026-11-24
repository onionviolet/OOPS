# UI harmony review (2026-11-19)

Weibao: "how can we improve the UI? It just feels disharmonious and not comprehensive or refined right now". This is a proposal (AD32). Nothing here is accepted until he picks.

## Evidence

- Native fight: `wolf-rats-1920x1080.png`. Duel: `counter-21-1920x1080.png`. Both in `~/.codex/visualizations/2026/11/18/01a1f085-3f61-7ae2-9a7e-18c7630a8478/shared-opponents/`. Built from the dirty tree at `96b0b8d04`, 21px Gothic.
- Crafting: [ps167-make-it-975d9da6a-1920.png](../representations/evidence/discord-surfaces/ps167-make-it-975d9da6a-1920.png). It is older, but it shows the same problems outside combat.
- Code counts on the working tree: 56 stylesheets; 585 raw-px padding, margin and gap values beside 1,159 `--ui-space` uses; 281 border declarations; 67 distinct `font-size` values, most of them tokenized. Colours are already tokenized: every hex literal is in `ui_tokens.css`.
- No new replay was run. Every claim below comes from these three captures and the grep counts.

## Root cause

The fix for the disharmony has already been written down. Nobody has carried it out. [PS217](../gm/dispatch/play-surface-2026-11-14/CONSIDERATIONS.md) (hierarchy by spacing, not borders), PS218 (shrink the panel bar), PS244 (one small vocabulary), PS292 (one coherence pass before more surfaces), PS294 (coherence review per slice) and PS296–PS298 (one fight view, boxes stop at content) all name it. Each lane kept shipping its own surface on top. The look is the sum of about fifteen lanes' local choices.

## Findings (visible in the captures)

| Code | Finding | Already owned by |
| --- | --- | --- |
| F1 | **Every box shouts equally.** Hero, inventory, opponents, actions and Reports all get the same bright double border, the same gradient fill and the same title weight. Nothing tells the eye where the moment is. In the native fight the center actions box is half empty, from y≈570 down to y≈990, while the hero box clips its last row. | PS217, PS298, DSG3 ("quiet in hierarchy") |
| F2 | **One colour carries five meanings.** Yellow marks the selected opponent, the "Next" tag, the Opening badge, narrator hints in Reports, Back to Notebook and Rat-step's Ready. Lavender report chips (Growth, Events…) appear nowhere else. There are three bar styles: the gradient HP bar, flat stamina and xp bars, and the saturated green skill bars in crafting. | PS244, PS103 state tokens |
| F3 | **Four navigation systems at once:** the top status strip, the center box tabs (Actions/Crafting/Mixing/Keys), the bottom bar (14–20 buttons plus All panels and Shortcuts) and the Reports chips. Expand, Compare, View and Latest also sit in box headers. | PS218 |
| F4 | **The two fights look like two games.** The native fight shows an exact hp bar, a stat grid and "Atk 6 piercing". The duel shows prose, a Condition bar, chips, a two-column verb grid and "Atk ~3.1". The hero box changes shape between them: a Readiness strip in one, an attack-cycle line in the other. | PS296–PS297, PS343 |
| F5 | **Debug text sits on the play surface.** "25 / 25 groups left · Clears: [0]", "[100%]", "Saving available. Pin", "Lv 0", "AP 35 EP 13", bracketed log headers, "Stances ???????" and a run of "X is now available in navigation" lines in Reports. Each line may be true and useful. They all have the same weight as the fight. | UR158, RPT rules |
| F6 | **The Gothic font gets no type contrast.** Gothic is the accepted default (AD40). Every role uses one size, one weight and wide tracking, including prose. Titles stand out only because they sit in a box. | PS244 (four sizes) |

## Bugs (fixable now, ui-cohesion lane)

- B1 Native fight hero box: the "weapon Iron sword" row is cut off at its bottom edge.
- B2 Duel hero box: "▶ Body · Human" is cut off under Condition.
- B3 Hero header: "Hero · You / Human · Lv 0" is set in three misaligned columns.
- B4 Crafting skills tab shows "Stances ???????" as a tab label.

## Three directions

| Code | Direction | Gains | Costs |
| --- | --- | --- | --- |
| O1 | **Enforce the vocabulary on today's layout.** Apply PS244 strictly: four type sizes, a 4/8/12/16/24 spacing scale, one border weight and a semantic colour list with one accent. Add a CSS ratchet for raw px and new colour roles beside the kit markup ratchet. | Low risk. Every screen improves a little and nothing moves. | It stays four equal columns, so F1 and F3 remain. It looks tidier but no clearer. |
| O2 | **One stage, quiet rails.** The center column becomes the stage. It is bordered, brighter and sized to its content, and it changes with the moment: fight, bench or talk. Hero, inventory and Reports become rails with no border, a dimmer background and smaller type. They brighten only when something in them changes. The bottom bar shrinks to Find, Save and Menu, and the rest opens from a palette (PS218). | It fixes F1, F3 and much of F5 together. The fight unification (F4) gets a home. | It touches the shell, so it needs a prototype before rollout. Rail density needs tuning at 21px. |
| O3 | **A typeset page, no boxes (the unusual one).** The whole screen reads like a printed almanac page. Columns are separated by gutters and rules, hierarchy comes only from type size, small caps and indentation, and colour appears only on state (hurt, ready, rare). | It is the most distinctive and most "refined". It fits the narrator voice and the LOTM and Hogwarts worlds. | It is the largest rewrite, it risks muddy scanning in long idle sessions, and Gothic at one weight fights it. |

**Recommendation: O2 as the target, built with O1's vocabulary as the method.** O1 alone keeps the equal-weight grid, and the equal-weight grid is the main source of the disharmony. O3 is a bigger bet than the current evidence supports. Revisit it as a selectable look once O2 settles.

## Actions, ranked

| Code | Action | Done check |
| --- | --- | --- |
| A1 | Pause new surfaces until PS292 lands: the kit renderer, the ratchet counting down, and a raw-px and colour-role ratchet added. | `check` fails on a new raw px value or a new colour role. The count only falls. |
| A2 | Prototype O2 on two moments, the native wolf-rat fight and the crafting bench, against the current captures (prototype-to-decision; PS228 blind panel as judge). | Weibao picks from a capture pair at 1920×1080 and 21px Gothic. |
| A3 | Give each colour one job: one accent for "your next action", PS103 state colours for state only, a narrator tint distinct from the accent, and one bar component for every meter. | One capture per world, with no colour used for two roles. |
| A4 | Do the fight view once (PS297). The duel and the native fight share the opponent row form, and the hero rail shows the same fields in both. This feeds the Codex combat review under PS343. | The two captures show the same row grammar and differ only where the engine differs (clock or turns). |
| A5 | Demote, don't delete, the debug-ish text (F5): counters move to hover or the inspector, and "now available in navigation" lines fold into one line. | The F5 strings no longer appear at full weight in the default captures. |

B1–B4 can go in now, separately from all of this.

## Round 2, 2026-11-19: the fight around its result and options

Weibao: "Shouting equally is fine, consider Yair and proto23, how we need to change our own combat ui to cover desired result of the combat, The combat options and more? ... it doesnt need to be 4 equal collumns ... What would o3 even look like?"

**Corrections to round 1.** F1 is withdrawn. Equal-weight boxes are the YAIR and Proto23 lineage, and he wants them. That removes O2's main reason, so the round 1 recommendation is replaced below. Columns are free: they can have unequal widths, rows can split a column, and a column can stack panels.

**His standing combat direction, from the Codex chat "Preview latest UI checkpoint" (2026-11-18):**
- Reports sit beside the fight, as in Proto23.
- Restore YAIR's attack bars, and let the bar climbing replace any wind-up label.
- Keep one Withdraw.
- The duel's You details go on the left, not repeated in the center.
- Use the bottom of the center for move previews.
- Humans and wolf rats share one colour scheme, and repeated foes share one name.
- Combine auto-fighting with normal fights, possibly by making normal combat automated move by move.
- Open questions in that chat: whether to section the opponents better, and what Mara's HP should show.

**What the references do** (his attachments, plus [Proto23's dummy capture](../../prototypes/workbench/evidence/character-2026-10-26/native/proto23-combat-1920-14.png)):
- YAIR: the fight box is the place. A date and weather header, the area name, then fixed-height enemy slots, each with one stat line, a red HP bar and a purple attack bar. Empty slots show how big the group can get. Clears and groups-left sit at the bottom. The exit button sits under the box. The log is one terse line per event, coloured by who got hurt.
- Proto23: You and the enemy are mirrored side by side, in the same form (name, title, HP bar with the number inside, a stat row). Place and flavour sit below. The log is full height on the right.
- Neither shows what the fight is for, how it ends or what losing costs. That gap is ours to fill.

**Mocks.** These are static HTML in the game's palette and its 21px Gothic bitmap. They are not wired to the engine and were not tested at 1800×1072 or Mac size.
- [Auto wave](../representations/evidence/ui-harmony-2026-11-19/fight-auto.png)
- [Duel under Take over](../representations/evidence/ui-harmony-2026-11-19/fight-duel.png)
- [O3 almanac page](../representations/evidence/ui-harmony-2026-11-19/almanac.png)
- Source: `fight.html` (`#auto` or `#duel`) and `almanac.html` in the same folder.

| Code | Proposal | Where in the mock |
| --- | --- | --- |
| C1 | **Terms block.** The fight's goal, then Win, Lose and Leave, each with live progress: group 1 of 25 for the wave, clean hits 2 of 3 for the contest. Special fights differ here: defeat, drive off, survive N beats, protect, capture, win a contest, escape. | Center top |
| C2 | **One clock, two control modes.** Every actor has a YAIR attack bar. Under Auto the bars run and the policy picks a move when yours fills. "Auto will: Quick strike" is always shown. Under Take over the clock waits at your Ready, which is move by move. Beats are how far your bar resets after a move. The native wave and the duel become the same screen in different modes. | Control row, You rail |
| C3 | **Opponents as fixed slots.** Each foe gets one row: name, health, attack bar and a Next tag. Defeated foes dim in place and keep their slot. A dashed slot shows room left in the group. The inspected foe's figures go on one line under the slots, mirrored against yours as Proto23 does. Mara uses the same row as a rat. Health follows what you know: an exact bar where the encounter reveals it, condition pips (■■■□□ Hurt) in the same place where it does not. | Center, opponents box |
| C4 | **Moves grouped by purpose** (Attack, Guard, Leave, with Technique and Items folded in). Each tile shows beats. A blocked move says why in place ("needs an opening"). Auto's pick is outlined. The preview below quotes the target, the odds, the timing against the foe's next act, and what the move does to the terms ("clean hit 3 of 3, you win"). | Center, moves and preview |
| C5 | **Consequences on the left.** "If you lose" and "Stops auto when" sit under You, so you see the cost before you commit or walk away. | Left rail |
| C6 | **A fight log with a summary line** (time in, dealt, took, progress, loot so far). Lines are terse and coloured by who got hurt, as in YAIR. Other news drops to a short Reports box underneath. | Right column |
| C7 | **The result replaces the terms.** When the fight ends, the same block shows what you got, what it cost and what changed (proficiency, things learned, standing with Mara). It then offers next group, rest or leave. | Not mocked |

**Colour within the fight (F2 applied).** Yellow means "now, or you can act". Red means harm to you. Green means progress toward winning. Dim means past or unavailable.

**What O3 looks like.** The [almanac mock](../representations/evidence/ui-harmony-2026-11-19/almanac.png) shows the same duel as a typeset page:
- No boxes. A masthead with the fight's name, then three columns divided by hairline rules.
- Small-caps section heads, a drop-cap paragraph for the terms, a numbered move list and a prose log.
- It reads beautifully for a contest, a talk or a ritual.
- It loses the at-a-glance bars that a long auto wave depends on.

**Recommendation (replaces round 1).** Keep the boxed YAIR/Proto23 look, and build the C1–C6 fight form as the one fight screen for both modes. Offer O3 later as a Look preset on the same data, for scenes and contests, not as the shell. O2 is withdrawn.

### More to consider (ranked)

| Code | Disposition | Point |
| --- | --- | --- |
| M1 | ACCOUNT FOR NOW | Two engines feed this screen: native auto combat (`src/models/combat.js`) and the tempo duel (`src/tempo_fight*.js`). C2 needs one fight view model that both fill. That is not an engine merge, which stays a later decision. Assumption: whether a waiting clock and a pending choice already save mid-fight is unverified. It needs the save, reload and import check (AD43) before C2 ships. |
| M2 | ACCOUNT FOR NOW | Idle play: most fights run unwatched. The summary line and the C1 progress must come from the same record that offline catch-up writes, or they will disagree after a return. |
| M3 | ACCOUNT FOR NOW | Terms are the observer's knowledge, not the truth. "Lose" can read "? what she wants" until learned (sealed-secret rules, PS341 D4). |
| M4 | ACCOUNT FOR NOW | "Stops auto when" is the hand-back cue the PS343 handoff asked for. Show only the stop rules the engine really checks, then make them editable later. |
| M5 | LATER | Multi-foe Take over needs targeting. The default target is the selected row, and the preview names it. Clicking a row and then a move should never need a confirm unless the target is ambiguous. |
| M6 | LATER | Allies and independent powers (a stand, a raised Gu) get mirrored rows under You, by the PS339 rule. Equipment states (deployed blades, charged arms) stay as lines on You. |
| M7 | LATER | In auto, the left rail's spare height can hold the drop table or bestiary entry for the inspected foe. Under Take over, it can hold your technique list. |
| M8 | LATER | O3 as a Look: the same data in typeset form suits contests, talks and exams. Test it there first, where reading beats scanning. |

### Next acceptance check

The C1–C6 form runs on the live Gothic UI for the wolf-rat wave and Mara's contest at 1920×1080, 1800×1072 and Mac size, 21px. The checks:
- Auto runs and stops on a rule.
- Take over waits at Ready.
- The preview quotes the effect on the terms.
- Withdraw appears once.
- Save, reload and import hold mid-fight.

## Rounds 3–4, 2026-11-19: absorbable, inside the standard shell, one system

Weibao asked whether the mockup system is easy to absorb, then asked for:
- fight results beyond winning (kill, incapacitate, take valuables, dying and respawning);
- less duplicate information and reformatted attack and defence options;
- narrative prose;
- standard and challenge combat as one system;
- the fight inside the normal UI, with the inventory and HP as they are.

**Absorbable?** The round 2 pages were not: they were drawn HTML. Round 3 rebuilt the form as a pure renderer, `renderFightForm(host, view, on)`. It draws through `src/ui/kit.js`, reads only shared tokens, and takes its aims from the contest engine's typed `WINNER_OUTCOMES`. Its harness still faked the shell. MW9 ([mockup system](../MOCKUP_SYSTEM.md#standing-rules)), written the same day, makes a mock a real-code branch. The work now sits uncommitted on a local `mock/fight-form-2026-11-19` worktree:
- `src/ui/fight_form.js` and `styles/fight_form.css`;
- fixtures marked `MOCK_STUB` in `src/ui/fight_form_fixtures.js`;
- a temporary harness under `scratch-harness/`.

Taking it means three steps. Mount the renderer in the real centre slot. Write native, tempo and contest adapters that return the same view. Replace the stubs. Then render it against master from one scenario save through Game MCP.

**Captures** (static fixtures, real tokens and Gothic, stand-in Hero, Inventory and Reports frames) are in [round4/](../representations/evidence/ui-harmony-2026-11-19/round4/):
- the wave, duel, won and down states at 1920×1080 and 21px;
- the duel and the wave at 1800×1072;
- the duel at 14px.

**What changed in the form (proposals):**

| Code | Change |
| --- | --- |
| C8 | **Inside the standard shell.** The fight takes only the centre column. Hero (hp, stamina, attack bar, stats) and Inventory stay the game's own panels. Fight-usable items are tinted there. Reports keeps its column, with the Combat view on. |
| C9 | **One fact, one home.** The terms are one narrative sentence that says what winning and losing mean, so "If you lose" and Win/Lose/Leave are gone. The move rows say what each move does, so the separate preview box is gone. The left mirror card is gone because Hero is You. The foe facts sit on one line under the selected slot. |
| C10 | **Aim, the result you fight for.** Kill, Drive off, Stun and pass, Capture (blocked with its reason). For a contest: Win by the terms, Throw the bout, Knock her flat, Kill (blocked: the watch would hang you). The chosen aim says what it means in one line. The ids are `WINNER_OUTCOMES` (CBR3/CBR4). |
| C11 | **One clock for both kinds of fight.** A beat ruler under the opponents shows who acts when, with a ghost of where your next turn lands. Auto lets it run, and Take over stops it at your Ready. The wave and the duel differ only in data: terms, aim, what is known of the foe, and the clock mode. |
| C12 | **Moves as rows, effect first** (UR70), grouped Strike, Hold, Leave. One line above the list says what the chosen move does to the terms. Exits are one inline row, because they are rare and each says its cost. |
| C13 | **Results replace the terms.** A win offers what to take (skin, search, next group, rest). A defeat says knocked out, not dead (AD19). It says what you keep, that cleared groups stay cleared (CBR10), and it offers rest, back in, home, or why you lost. |
| C14 | **Narrative log lines:** "A wolf rat gets its teeth into your calf. 4.5". Player text carries no rule codes. |

**Found on the way.** B5: the kit names `--ui-muted`, but no stylesheet defines it, so `kit-row__fact` text falls back to full brightness. The form supplies a local fallback until the token exists.

### More to consider, rounds 3–4 (ranked)

| Code | Disposition | Point |
| --- | --- | --- |
| M9 | ACCOUNT FOR NOW | Native combat publishes only `unconscious` today (`src/defeat_domain.js`), and only the contest engine knows winner outcomes. Aim needs the native engine to publish `killed`, `drove_off` and `knocked_out` through the one outcome publisher (CBR2). Loot then follows the outcome (CBR3). |
| M10 | ACCOUNT FOR NOW | The aim must change behaviour, not just the label: what Auto picks, what loot drops, and what survivors remember (CBR15). An aim that changes nothing is a lie on screen. |
| M11 | ACCOUNT FOR NOW | Death and respawn: the default stays knocked-out recovery (AD19). Killing writes law and memory (CBR29), and captives stay people (CBR28). A harsher world states its loss on the terms line before the fight (CBR6, CBR23). Away fights stop at downed (CBR27). |
| M12 | ACCOUNT FOR NOW | At 1800×1072 and 21px the wave fits only after the exits were made inline. A long foe list or a third move group will overflow. The centre needs a rule for what folds first (aim note, then the foe facts line). |
| M13 | LATER | "Take valuables" is a result choice for animals but a crime or a negotiation for people (CBR28, CBR30). For a person, the result row should offer search, demand, or let go, with the law's response quoted. |
| M14 | LATER | The ruler and the Hero attack bar show the same timing twice. Once the ruler proves itself, the Hero bar could become the ruler's "you" lane. |

## Round 5, 2026-11-19: the board leads, in the live game

Weibao: "why is it opponent low, actions high ... it should be flipped, also consider less text since the text right now kind of sucks ... Consider YAIR and proto23 style, and then organizing the possibilities? What about abilities? styles? using consumables". This round reads "low" and "high" as visual weight. In round 4 the opponents had about a quarter of the centre and the moves about 45%.

**Built on the real game this time (MW9).** On local branch `mock/fight-form-2026-11-19` (uncommitted, not pushed):
- `renderEnemy` in `src/village_workspace.js` draws the form from the real native opponent board through `src/ui/fight_form_native.js`, and redraws only when the view changes. The side Opponents list stands down.
- The terms, aim and Auto stop rules are `MOCK_STUB` lines inside the adapter.

**Captures.** Master is committed `f6979dc7c`; the variant is the branch working tree. Both come from the same mid fixture and seed 7, in the wolf-rat wave with one rat down, 21px Gothic, through `prototypes/live-layout/serve.mjs`. Files are in [round5/](../representations/evidence/ui-harmony-2026-11-19/round5/).

| Code | Change |
| --- | --- |
| C15 | **The board leads.** The opponent slots fill the centre box: YAIR fixed slots, a big HP bar, an attack bar, and one terse stat line (Atk · Spd · Hits you · You hit · Ddg · Def) on the inspected slot. Defeated and empty slots shrink to a line. In the live capture the board takes about 390px against master's 293px, which master shares with Encounter. |
| C16 | **One-line header.** The goal (the terms are in its hover), progress (groups left, cleared, standing) and the Aim chips. The paragraph is gone. |
| C17 | **The band follows the mode.** Under Auto it is one line: Auto, Take over, and "Auto: strike the Wolf rat", with the stop rules on hover. Under Take over it becomes tiles: a basic row from the weapon and a technique row with ready marks. Names and beats go on the tile; what a move does goes in hover. The Take over band was not captured live this round (see open items). |
| C18 | **Less text.** Explanations moved into hover and focus. Narrative lives only in the Reports log. |

**Where each possibility lives (proposal):**
- **Style or stance:** the Hero panel's stance selector, which master already shows as "Normal Stance · Finish". A mode, not a move.
- **Consumables:** the Inventory panel. Fight-usable items are marked there and Auto's policy may use them. They are not repeated in the centre.
- **Moves:** the weapon's basic set (CBR17) as the first tile row.
- **Techniques and abilities:** the second tile row, with ready or opening marks. Passive effects show on Hero.
- **Allies and independent powers:** board rows under the PS339 rule.
- **Exits:** the native Actions box.

**Found in master** (from the live capture):
- F7: master's Actions box shows "Go back to entrance [5m]" and "Withdraw: Go back to entrance [5m]" for the same exit, against PS343's one Withdraw.
- F8: committed HEAD does not build in the live-layout tree, because `scripts/perf/lib.mjs` omits `scripts/gen_capability_runs.mjs` from its tree paths. An uncommitted fix sits in the main checkout.
- F9: preview worktrees need `resources/fonts/private` linked (PS293 again).

### More to consider, round 5 (ranked)

| Code | Disposition | Point |
| --- | --- | --- |
| M15 | ACCOUNT FOR NOW | The duel still draws master's fight card. Its adapter (`tempoSituation` view → fight form) and Take over tiles need the same hook in `src/combat_situation_ui.js`. Until then the "one system" claim is shown for the wave only. |
| M16 | ACCOUNT FOR NOW | The branch is cut from the committed tree, but PS343's combat work is uncommitted in the main checkout. Absorbing either one needs the other merged first, or the two will conflict in `village_workspace.js` and the fight owners. |
| M17 | ACCOUNT FOR NOW | Hover-only explanations need a keyboard and touch route (UR41, UR156). The absorbing build swaps `title` for `kitTooltip` on hover and focus. |
| M18 | LATER | The board box has room for a fourth slot at 21px. A crowded wave (5+ foes) should switch to two columns of slots before it scrolls. |

## Round 6, 2026-11-19: the duel on the same form

Weibao: "Yes, hook the duel".

The duel's `renderTempo` in `src/combat_situation_ui.js` now draws the fight form from the real tempo projection through `src/ui/fight_form_tempo.js`. The wave and the duel are one renderer.

**What the duel shows:**
- Mara's slot with her condition, plus a stat line of what you know: Hits ?, Wind, Wants, Seen.
- A Take over band with the body aims as chips (Anywhere, Head, Body, Arm, Leg). These are the engine's own `aim` command.
- Moves as tiles with beats, through the engine's `move` command.
- Back away and Yield on the exit line.
- The latest line beneath the tiles.

The engine's "If they go down" terms (finish, spare, take alive, ask) map onto the outcome chips. They only appear when the fight carries an approach strip, which this committed build's road contest does not.

**Captures:** same mid fixture and seed, 21px, [round6/](../representations/evidence/ui-harmony-2026-11-19/round6/): master and variant duels at 1920 and 1800, and the variant wave at both sizes. No page errors. Focused tests `combat_situation` and `village_workspace` pass, 19 of 19. They do not exercise the mock path.

**Found:**
- F10: with the board sized to its content (PS298), the shell's fight region stays a fixed height, so the leftover band shows as empty space in both fights. The fix belongs to the region size in `layout_spec.js`. Under PS298 that space should go to Reports and the fight log, and that change overlaps the YAIR columns remock.
- F11: master's duel card shows "?/?hp" with a filled bar, so the fill gives away a number the text hides. The variant keeps the fill under the condition word "Fresh", so the same leak remains.

| Code | Disposition | Point |
| --- | --- | --- |
| M19 | ACCOUNT FOR NOW | The duel's opponent attack bar is empty: the tempo projection gives readiness in words, not a fraction (DU10). The board needs either a fraction from the engine or a word track. |
| M20 | ACCOUNT FOR NOW | The Rat-step counter, the Opening tag and the approach strip live in uncommitted PS340/PS343 code. They reach this form only after that work is committed and this branch is rebased (M16). |
| M21 | LATER | Fight on (Auto) in the duel is wired to the engine's `run`. It was not exercised in the capture. |

## Round 7, 2026-11-19: coherence fixes, recaptured against master

Weibao: "are these incoherent? how to make it better? Remove AI prose?", then "Go ahead, fix those and recapture".

**Fixed on `mock/fight-form-2026-11-19`:**
- F12: the outcome row is now called Ending and the body row Target.
- F13: the opponent stats use the Hero panel's words (Attack, Speed, Defense, Evades, Hits you, You hit), and the duel shows "Attack ?".
- F14: opponent bars use the Hero bar's tokens (`--p23-track`, `--p23-health-fill`, `--p23-dark-value`).
- F15: buttons are one size in both hosts.
- F16: yellow now marks only your own choices.
- F17: in the wave, the goal is the box title.
- F11: the duel shows condition pips plus the word, with no fill for a hidden number.
- F7: the native fight card no longer repeats Withdraw. The band carries the one Withdraw, which clicks the place's real route. "Go back to entrance [5m]" stays in the place's route list.

**Captures:** side by side with master, from the same mid fixture and seed, 21px, at 1920×1080 and 1800×1072. They are in [round7/](../representations/evidence/ui-harmony-2026-11-19/round7/). There were no page errors, and the focused tests passed 19 of 19.

**Left for the shell or the YAIR columns remock:**
- F10: the fixed fight region leaves empty height.
- Here's noun-stack descriptions ("Residence rights, furnishings, storage and optional home beginnings.").
- Reports' "X is now available in navigation." lines.
- "Go back to entrance" still sits in the route list beside the band's Withdraw.
- The wave's stat line renders a size smaller than the duel's.

## Round 8, 2026-11-19: PS297 built, the duel in the native Opponent box

Weibao: "Go ahead, build PS297 and amend AD8." AD8 is amended in the
[rules index](../RULES_INDEX.md) and the
[direction log](../gm/USER_VISION_LOG_2026-11.md#estimated-opponent-numbers-and-one-fight-view-2026-11-19).
The build is on local branch `mock/fight-form-2026-11-19` (MW9), uncommitted.

What changed:

- The custom fight form (rounds 5–7) is retired. The wave is native again and
  pixel-identical to master.
- The duel draws its foes through the native Opponent box.
  `src/ui/tempo_board.js` turns `tempoSituation`'s versus row into the native
  board shape. `village_workspace` uses it when no native wave is live. The
  duel card hides its own versus row and keeps its moves, the stance fold
  (stakes, stance, terms, losing, Target) and the foot row.
- AD8 ladder in the adapter. No basis shows `???`. A number learned from blows
  or hearsay shows `~N` (knowledge `partial`). A known number is plain. The
  card already rendered these three states, so no new renderer was needed.
- M19 closed: the duel's 0–1 attack timer fills the native attack bar (DU10:
  a bar, never a printed number).
- Wants and Seen are sentences, so they moved from the number grid to the
  name's hover. They overflowed the two-column grid in the first capture.

Evidence (`representations/evidence/ui-harmony-2026-11-19/round8/`):
`ps297-duel-side.png` (master left, PS297 right, 1920), `ps297-duel-1800.png`,
`ps297-wave-side-half.png`. Checks: both captures ran with no page errors;
focused tests 39/39 (combat_situation, combat_versus, opponent_board,
village_workspace) plus the new `tests/tempo_board.test.js` 1/1. Not run:
`check:flow`, the full suite, save/reload (no persistence change).

### Findings, round 8

- F18 (fixed in round 8b). Lost from the duel face: the foe's damage-type chips ("takes normal
  bludgeoning", "Not sized up") and your mix line ("Strikes: bludgeoning
  100%"). The native board has no row for either. Either add a Types fact row
  to the board (one home for wave and duel) or accept the hover.
- F19 (fixed in round 8b). The duel card still says "Village: 1 opponent standing." The Opponent
  box now says it too (DSG11 one home). The card line can go.
- F20. During the duel the centre loses Here (people, things), as it does in a
  native wave. That is consistent, and it matches PS297's one-view goal.
- F21. "Seen: looks stronger than you" is a basis for an Attack estimate, yet
  Attack shows `???`. Turning a sense word into a range (for example "above
  yours") must stay honest (CBR16). It needs a rule for which sense words map
  to which side of your own number.

### More to consider, round 8 (ranked)

- M22. Same treatment, less care: the native board already scales detail by
  count (list, grid, grouped letters). Minor foes are those beyond the first
  group or with a `minor` rank. They get name, bar and attack bar, with facts
  only on inspect. Named foes (Mara) get the hover note and the full facts
  line. The adapter can carry a `rank` field; the board needs no new form.
- M23. Estimate ladder storage: the ladder's state (heard, seen blows,
  studied, felled, revealed) belongs to the bestiary or person record, not the
  fight. That way a second fight starts from what you learned. That is a save
  slice with a migration (AR rules), so it is a separate lane.
- M24. Per-world means jump the ladder: appraisal skills, a Beyonder's
  spirit vision or a Gu's sensing worm set knowledge to `known` for chosen
  facts. That is one `reveal` hook per means feeding the same knowledge field.
  Do not add a parallel display.
- M25. Advantage settings as unlocks: "exact enemy numbers" (AD8's setting)
  and Auto's stop rules are advantages. Under Weibao's direction they become
  features earned in play (a bestiary milestone, a trained skill). The Display
  setting stays for accessibility only if it is named as such. Not built.
- M26. Future techniques, abilities, passives and interactions all land in
  the card's existing slots. Active moves go in the move list (fold by use,
  PS207). Toggles and stances go in the stance fold. Passives go in the Hero
  panel's Condition. Consumables go through Inventory's use, with the fight
  reading the result. Reactions (counter, parry window) need a timed decision
  point. That is S3 (decision points), the next design option to frame.
- M27. The wave's own card should gain the same stance fold and foot row as
  the duel's card. Then "one system" holds for actions as well as foes. That
  needs native combat to publish terms (CBR2/CBR3, M9).

### Round 8b: F18 and F19 fixed

Weibao: "Yes, fix F18–F19."

- F18: the board gains a Threat row and a Takes row. Threat shows `???` until
  the foe is sized up (AD8: no basis), then the threat word and the hardest
  blow. Takes lists the learned damage types; a normal match shows the bare
  type ("bludgeoning"), and a resist or weak spot keeps its word. Your mix
  rides the Takes row as the own value ("You: bludgeoning 100%"), through a
  `fact.own` field the native fact renderer now honours. Intent is left off:
  in the duel it is always "unread", so a row would never carry information.
- F19: the card's stakes line now shows only bodies waiting on you ("1 down
  at your feet."); it hides when none are down. Who is standing lives in the
  Opponent box.

Evidence: `round8/ps297b-duel-1920.png`, `round8/ps297b-duel-1800.png`. No
page errors; focused tests 40/40 including the extended
`tests/tempo_board.test.js`. Still truncated: the native board's "Sta..."
label (column width; not checked against other boards).

## Round 9, 2026-11-20: the fight beside Hero, moves under the opponent

Weibao: combat should "take up a bigger space, and be next to the hp/ our stats
panel", with "the atatack options and stuff ... below their Hp". Logged in the
[direction log](../gm/USER_VISION_LOG_2026-11.md#the-fight-sits-beside-the-hero-2026-11-20).

What was wrong: the layout enters its fight arrangement only when the native
Combat panel shows (`workspace_layout` `parityCombat`). A tempo duel never
counted, so its Opponent box stayed in the Journal column (PS192). The fight
card always anchored after the place's action list, under the place text and
routes, so in the village its moves fell out of view.

What changed (mock branch, uncommitted):

- `workspace_layout.js`: a live tempo duel counts as a fight, so the Opponent
  box takes the column beside Hero, as the native wave's does.
- `combat_situation_ui.js`: while the opponent board is in the centre, the
  fight card (moves, stance fold, Fight on, Back away or Withdraw) sits directly
  under it. Both fights use this.
- `styles/fight_centre.css`: inside the box the card keeps the box's text size
  (it rendered at 14px against 21px), and board and card stack at their own
  heights; the box scrolls rather than overlapping them.

Evidence (`representations/evidence/ui-harmony-2026-11-19/round9/`):
`r9-duel-side.png` and `r9-wave-side.png` (master left, 1920),
`lay-duel-1800.png`. Both captures returned no page errors. Focused tests
71/71 (adds home_layout, layout_spec, shell_composition). Not run:
`check:flow`, the full suite.

### Findings, round 9

- F22. The wave's card is a short centred block (stance line, Withdraw). It
  now reads as a footer to the board, but its terms still come from the
  MOCK_STUB era (M27): native combat needs published terms for it to match the
  duel's fold.
- F23. In the wave, the Opponents list panel still shows below with the same
  two rats the board shows (the crowd list from two foes, OPPONENT_LIST_FROM).
  With the board in the centre it repeats the board.
- F24. The Journal column is mostly empty during a fight. It could take the
  fight log or yield width to the fight column; that is a layout-spec choice
  (F10), not built.
- F25. The duel capture had to press "Back to Village" first: a fight started
  from the Notebook leaves the Notebook view in the centre. The fight should
  claim the centre when it starts.

## Round 10, 2026-11-20: Fang Yuan's crippled wolf pack (RI ch122–123)

Codex follow-up from the shared UI review: use the ch122–123 pack hunt for the next combat UI pass; check the source and the
contest fixture first; tune around pack pressure, Moonglow and remaining primeval essence; keep the book encounter apart from
the single-wolf patrol; Mara stays the regression check; return a before/after from the playable route or name the missing route.

### Source check (private copy `reverend-insanity/private/source/ri2`, ch122 hunt, ch123 aftermath; read in full)

Stated in ch122:

- The pack is "twenty or more" crippled lightning wolves in early-winter snow near the village: the old, blind, tailless and
  sickly, expelled from the nest. They are cunning. One wolf rolls under a blade.
- Moonglow: one moonblade beheads three wolves in a line before the fourth dodges. A moonblade costs a tenth of light red
  essence at rank two. Fang Yuan, at false upper stage, can throw up to sixteen. Before the hunt he still held more than half his
  dark red essence.
- He fights by moving through their joint attacks. The pack drops by about half; then a wolf howls and the rest retreat.
  No injury to him is stated.
- After the fight he finishes the dying wolves and bags skins and teeth. A larger crippled pack, or a small healthy pack,
  would be trouble.
- Ch123 has no fight.

### Fixture check (`src/contest_packs/gu_world.js` `crippledPackHunt`)

Matches: 20 wolves, weak bites, kiting, pursuit, no surrender.

Does not match (proposals for the contest-pack owner, not edited here):

- R10-F1. `sides.pack.breakAt: 0.25` routes the pack when a quarter has fallen (`contest.js:471` counts fallen ÷ members).
  The source breaks at about half.
- R10-F2. `moonglow_blade` hits one wolf for 4 of 20 essence, so five blades. The source cuts three in a line and allows up
  to sixteen blades. The fixture cannot reproduce half the pack falling to blades.
- R10-F3. The `kiteCrowd` note says the scene costs "about the six health". The source states no injury.

### Routes

- **Missing route (the book encounter).** No played route reaches the pack hunt. `crippledPackHunt` is driven only by
  tests (`contest_choice`, `contest_consumers`). In the game, `book_gu_lead_wolf_front`'s `fight_the_crippled_pack` is a
  one-click lead-life act that writes the outcome note; no fight opens.
- What the route needs (runtime owner): a tempo opener, or a contest-backed play surface, that turns the act into a fight
  with about 20 foes. It needs a line-hit blade, a pack break dial and a pack-pressure readout the board can draw. That
  readout is how many wolves are close or attacking this beat, and how near the break is. None exists today.
  Presentation can draw it once the projection carries it.
- **Playable route (not the book encounter).** `ri.wolf.tide`, "Hunt a lightning wolf on the tide", is one wolf (or one
  large wolf) beyond the wall. Captured from a composed save: the `ri-fang-yuan-wild-gu` fixture plus a Moonglow Gu. The
  Moonglow is hungry in that save. Feeding is reachable only after Rank Two plus the day extension. A composed feed
  record is refused on load ("Settled extension work requires its saved content pin"), so the capture is honest: fists,
  with Moonblade blocked.

### Presentation changes on the playable route (mock branch, uncommitted)

- Your fight means are back on the card ("Essence 44"). Round 8 hid the versus row, and that row was the only live home
  of the fight's essence. The status bar's reserve stays at the pre-fight value until the fight writes back.
- A move that spends a means (Moonblade) stays on the face, usable or not. The hungry Moonglow now shows as a dashed
  Moonblade with its reason under it. On master and before this round it hid under "More moves (2)".

Evidence (`representations/evidence/ui-harmony-2026-11-19/round10/`): `ri-side.png` (master left, branch right, 1920),
`after-ri-1800.png`, `mara-duel-1920.png` (regression), `wave10-wave-1920.png`, plus the capture scripts `ri_save2.mjs`
and `ri.mjs`. Every capture returned no page errors. Focused tests pass 82/82. Not run: `check:flow`, the full suite.

### Pack pressure, for when the route exists (proposal)

- The board already groups repeated names with a count ("Lightning wolf · 20"), and the grid layout shows many foes. The
  missing reads are: close now (how many can bite this beat), fallen versus the break line ("8 of 20 down · they break near
  10"; an estimate per AD8 until learned), and a blade's line ("cuts up to three in a row").
- Moonglow: the move tile shows blades left at the current essence ("Moonblade · 4 essence · 11 left").
- The patrol keeps its one-wolf form. The pack hunt is a separate opener title ("The crippled pack in the snow"), so the
  two never share a label.

### Round 10 follow-up: live status-line essence (2026-11-20)

Preflight: correct the existing status reserve, which read the ordinary energy ledger while an open tempo fight owned the
current spend. Authority: bounded status-line correction requested by Weibao; AR3, AD36, AD43 and UR167. Extend
`src/ui/status_line.js`'s existing reserve reader, using the current player's fight means for Fang Yuan's primeval pool only;
keep the pool's label/capacity. No engine, route, balance, save or writeback changes. Ordinary route is the existing
`ri.wolf.tide` opener; a fight without essence keeps the ordinary pool. UI surface: the existing reserve slot, at 1920×1080,
displacing nothing. State sheet: outside fight = ordinary reserve; open fight = live player essence including zero;
settled fight = ordinary reserve again. Existing voice: "Green-copper primeval essence 44/44". Ring: read-only UI consumer.
Owned files: `src/ui/status_line.js`, `tests/ui_spine_ready.test.js`, this receipt and named evidence. Failure scenario:
the line freezes at 44 while a Gu move spends essence, or hides recovery behind a settled fight. Focused regression
checks both, plus absent means and another world. Core-owner files touched: zero; registration lines: zero.

Implementation: `statusReserveWords` overlays only the RI primeval row from a live tempo fight's player means. The existing
one-second status refresh renders it. Settlement remains the sole writer. Focused test: 12/12 pass. `check:rules`: exit 0.
`check:flow`: 14 desktop routes and zoom checks, zero findings (two existing baseline strays). `check:arch`: exit 1 on
the shared checkout's unrelated `main.js` growth, 10117 lines against 10115; this correction does not touch that file.
Candidate: shared dirty primary checkout at HEAD `71c97305008e66ef8acd5e89ff1b1ac0f636be15` plus these source hunks.
Evidence directory: `representations/evidence/ui-harmony-2026-11-19/round10/live-essence/` (logs, reproducible script,
screenshots and `report.json`). Fresh-origin rebuilt browser proof, bundle SHA-256 prefix `86e07197f86ca4a3`, exit 0:
composed `ri-fang-yuan-wild-gu` plus owned Moonglow and Black Boar Gu; opened the existing single-wolf hunt, clicked
Black Boar fist (one essence), then Back away. Outside: 44/44; after spending: status 43/44, fight 43, ordinary pool still
44; after exit: status 43/44, ordinary pool 43 and fight removed. No page errors. Screenshots inspected at 1920×1080.
The script initially inherited the older capture's Back-to-Village step; the current fight already claims the centre, so
that step hid its controls. Removing the obsolete step let the real clicks pass. No source correction was required.
FLR1–FLR4 and FLR6: agent-verified on this named fixture, not human-reviewed. FLR5: n/a, persistence unchanged.
Gaps: unrelated shared architecture failure above; full suite and push gate not run for this bounded uncommitted slice.

### Cross-world combat cue check (2026-11-20)

Preflight: play the existing Fang Yuan single-wolf patrol and Tingen back-lane knifeman against the same questions:
what means/choice is available, what blocks it, and what changes after a spend or escalation? Authority: Weibao's requested
combat lane; AR3, UR167, AD36 and AD43. Existing owner: `src/combat_situation_ui.js`, the tempo card's settings fold and
authored stakes cue. Ring: read-only presentation; no new route, fight rules, save/writeback or balance. Desktop 1920×1080,
populated existing fixtures. Candidate failure: a material shift's reason exists in the fight projection but hides inside
the settings fold. Compare an unchanged hungry-Gu reason/spend against a played Tingen escalation before selecting a
bounded fix. Preserve the mock owner's existing card/preview hunks. Checks: focused fight presentation/kit tests and
rebuilt fresh-origin before/after browser play. Receipt follows when verified.

Same player questions, before and after:

| Route | Means/choice and blocker | What changed |
| --- | --- | --- |
| Fang Yuan single-wolf patrol | Composed `ri-fang-yuan-wild-gu` with owned Moonglow and Black Boar Gu. Keyboard focus on disabled Moonblade previews its four-essence cost and “The Moonglow Gu is hungry and will not cut. Feed it first.” Black Boar fist is available for one essence. | Clicked fist; live essence and the status line drop 44→43. Its block and spend cues already work; no RI mechanics or presentation changed in this pass. |
| Tingen back-lane knifeman | Fresh played Klein start through `pick_be`/`enroll_be`, then the existing `lotm.lane.knife` opener. Quick strike, Brace, Tend, plea, Yield and Back away are present. The plain moves use time/stamina, with no Gu pool projected onto Klein. | Played Quick strikes until his existing knife trigger fired. The engine changed robbery to lethal and supplied “The knifeman drew a knife.” Before, that cue hid inside the collapsed settings, whose summary only said “can be deadly.” |

Bounded fix: only the settings-fold hunk in `src/combat_situation_ui.js`. Move its existing authored cue outside the fold;
the summary uses the existing “now deadly”/“no longer deadly” state wording. The player's settings still fold. No new
nodes, rules, controls or narration were added. Existing mock-owner layout, move-preview and blocked-control hunks stay
intact. After rebuilt replay, “Robbery · now deadly” and “The knifeman drew a knife.” are visible together while settings
remain collapsed. RI's hungry preview and 44→43 spend are unchanged. Before/after Tingen stakes and combat logs match
exactly, as do RI spend, status and combat logs.

Candidate: dirty primary HEAD `71c97305008e66ef8acd5e89ff1b1ac0f636be15`; rebuilt before bundle
`506247e19b1da497`, after `ba2674141e6a47d3`. Fresh origins, 1920×1080, screenshots inspected; both browser runs exit 0,
zero page errors. Replay and before/after screenshots/JSON:
`representations/evidence/ui-harmony-2026-11-19/cross-world-cues/`. No private save included.
Focused `node --test tests/combat_situation.test.js tests/combat_surface_types.test.js tests/tempo_kit.test.js tests/combat_focus.test.js`:
exit 0, 46/46. `check:rules`: exit 0. `check:arch`: exit 1 on the unchanged shared `main.js` 10117-versus-10115 baseline;
cyclic edges remain 205. `git diff --check`: exit 0. `check:flow`: exit 0, 14 desktop routes and zoom at 125%/150%,
zero findings, two existing baseline strays. Core-owner files/registration lines:
zero. FLR1–FLR4/FLR6: agent-verified named-fixture and fresh-life routes, not human-reviewed; FLR5 n/a, persistence
unchanged. Full suite and push gate not run; no commit or push.
