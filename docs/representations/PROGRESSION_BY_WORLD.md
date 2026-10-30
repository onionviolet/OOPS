# Progression by world (proposals, 2026-10-30)

Status: **proposal (AD32).** Nothing here is accepted, built or played. It answers Weibao's 2026-10-30 direction ([USER_VISION](../USER_VISION.md#abilities-no-hardcoded-path-2026-10-30)): each world gets its own progression system and UI, paths branch, mixing is possible with risk, and learning reveals benefits. Plan: [book UI wave rounds 5-7](../gm/dispatch/book-ui-wave-2026-10-30/PLAN.md). Rules applied: AD5 (default, dial, reason), AD38 (mechanisms), UR37 and UR38 (no fact in color or motion alone), UR70-UR75 (say what a number means), CLR3 (counts and ids only from private rows; book text stays private; sealed secrets stay sealed).

Evidence base. Counts are unique rule ids from the [gap map shared-seam table](../research/READING_GAP_MAP_2026-10-28.md) (ADV rank and advancement, ABL abilities, SPL spells, MND mind effects, MAK making, time-loop slug), plus the merged `wb8` `extras.jsonl` kind tallies for eight books. **LOTM has no `wb8-merged-2026-10-30` folder**, so its counts come from the gap map column and its `l10-abilities` and `wb-families-lotm` briefs. Qualitative notes come from the committed `docs/worlds/*_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` passes (reader claims, source-spot-checked at best) and from the repo's own world docs. GC and PR have little rank text, so their rows below are marked *thin* and lean on id names.

## 1. World table

| World | ADV | ABL | SPL | Other signal | Unit of growth | Shape | Default form (dial) |
|---|---|---|---|---|---|---|---|
| LOTM | 582 | 1,744 | 108 | RIT 989, DIV 484 | a rung of a pathway (potion, digested by acting) | ladder, with neighbour swaps | **Sequence ladder with digestion** (how much digestion is shown) |
| COI | 24 | 52 | 4 | RIT 44, loops 10 | the same rungs, held through a Circle of resets | ladder plus wheel (resets) | **Sequence ladder plus a Circle strip** (how far the strip is known) |
| HP | 0 | 45 | 325 | LAW 203, KNW 48 | a spell, then a subject grade at an exam gate | field with year gates | **Report card plus spell field** (how formal grades are) |
| MoL | 1 | 89 | 188 | MND 140, loops 31 | what you know and a mana reserve | field, no rank | **Loop notebook plus reserve gauge** (whether the gauge shows numbers) |
| SS | 273 | 530 | 96 | ART 191, MAK 259 | a rank, a core of shards, an aspect, a shelf of memories | ladder with a branching aspect tree | **Status window** (how much the character can read) |
| GC | 10 | 107 | 5 | CRE 88 (thin) | a body feature gained or lost | none | **Body dossier, no ranks** (how many features are named) |
| PR | 0 | 362 | 3 | loops 33 (thin) | a power and what the loop teaches | none | **Power list with source tags plus a loop notebook** (how much carries over) |
| RI | 225 | 402 | 7 | ORG 209, ECO 44 | a realm with substages, an aperture, dao marks | ladder with substages plus a field | **Realm meter with a breakthrough, plus aperture vessel** (how exact the meter is) |
| ASL | 101 | 87 | 283 | LAW 190, ORG 205 | a rank, an essence intake, a standing in a cohort | ladder plus a cohort ranking | **Service record with a tablet standing** (who can see it) |

Reading it: ADV is high only in LOTM, SS, RI and ASL, so those four earn a chain. HP, MoL, PR and GC score 0 to 10 and would be forced into a fake ladder; their growth lives in SPL, ABL or knowledge rows, so their defaults are a field, a notebook or a list. COI's 24 ADV ids are a small share of its 232 rule ids because it reuses the LOTM pathways; its own nuance is the Circle (RIT 44, loops 10).

## 2. Per-world sections

Each section answers the eight questions: unit, shape, how growth happens, branching and mixing with outcomes, failure and loss, numbers in-world, who sees your standing, what you know about your own progress. Then default, dial, reason, and at least two alternatives with why they fit worse (round 2 item 18).

### LOTM (Lord of the Mysteries)

- **Unit and shape.** A rung (Sequence 9 down to 0) of one pathway. Chain, with rungs 9 to 7 shown in the pack and the rest stubbed (`book_world_lotm_path.js`, Sequence 7 stub; GM25).
- **How growth happens.** Drink the next potion, then digest it by acting the role until it settles. A rung is not safe to leave until digestion is done (ADV, MAK and ACT are merged because lanes drifted, 227/184/175/106/140/54/62/26 by volume).
- **Branching and mixing.** Neighbouring pathways exist as data (`book_world_lotm_pathways.js`); a swap or a wrong-order intake is a mix edge. Outcome: loss of control, bodily change, or death (COR 103 ids).
- **Failure and loss.** Failure is the loss-of-control family; demotion is rare and is a world-specific event, not a rule.
- **Numbers in-world.** Rung numbers exist and are said aloud. Digestion has no number, only a felt state ("settling").
- **Who sees.** Other Beyonders can sense or divine your rung at a gap (`rank_gap_observer.js`); ordinary people cannot.
- **Self-knowledge.** You know your rung and how settled it feels. Higher rungs are rumour until learned.
- **Default.** Chain ladder with a digestion fill and acting chips (already shipped via `ladderFigureSpec`). **Dial:** felt words only, or a percentage once the character has a method to measure it. **Reason:** the ladder is the true shape and digestion is the real play loop.
- **Alternatives rejected.** (a) Web of pathways: right for the "neighbours" question, so it is a secondary view of the swap strip, but as the main form it hides which rung you stand on. (b) Passive tree: implies free choice at each node, while rungs are ordered and one-way.

### COI (Circle of Inevitability)

- **Unit and shape.** The same Sequence rungs (24 ADV ids; the pathways are shared with LOTM) held inside a Circle. Chain plus a wheel of resets.
- **How growth happens.** Same potion and digestion loop; a Circle gives repeated attempts (loops slug 10; Circle ability rows nine uses per charge, from the committed COI pass F19).
- **Branching and mixing.** Reuses the LOTM swap and mix edges; characteristic convergence means meeting neighbours more often at higher rungs (stated, F18).
- **Failure and loss.** As LOTM, plus Circle exhaustion: a Circle ends after its resets are used.
- **Numbers.** Rung numbers in-world; Circle uses and cooldown are countable.
- **Who sees.** Church and Bureau staff recognize rungs by sense; the Circle itself is known only to its holder.
- **Self-knowledge.** You know your resets used and left. What the Circle does to others' memory is a sealed matter and stays on its discovery route.
- **Default.** The LOTM ladder plus a ring strip showing Circle number, uses left and resets spent. **Dial:** how much of the Circle the character understands. **Reason:** sharing the ladder keeps one pathway dataset (no COI copy), and the ring shows the one thing COI adds.
- **Alternatives rejected.** (a) Notebook (like MoL): the Circle is a counted resource, not only knowledge. (b) A pure wheel: it would drop the rung the character stands on.

### HP (Harry Potter)

- **Unit and shape.** A spell learned, a subject graded. A field of subjects with year gates (ADV 0; SPL 325; grade ladder and NEWT gates cited in the committed HP pass).
- **How growth happens.** Lessons, practice and exams; a spell moves from heard to tried to fluent. Wand and temperament shape what comes easily (reader claims).
- **Branching and mixing.** Subject choices at a gate (OWL to NEWT, careers advice) are branches that close doors; mixing is not a rank concept, but forbidden or dark magic is a risk edge with law consequences (LAW 203).
- **Failure and loss.** A failed exam closes a path; accidents and detentions cost standing. No demotion in the rank sense.
- **Numbers.** Letter grades and house points exist; spell power has no number.
- **Who sees.** Teachers, prefects and the school see your grades and house points; classmates see casting.
- **Self-knowledge.** You know your marks and which spells you can cast; your latent talent is a hint at best.
- **Default.** A report card (subjects by grade) beside a spell field with mastery marks (heard, tried, fluent). **Dial:** how formal grades are (a loose "teacher says" line, or full letters by term). **Reason:** growth is in knowledge and marks, and a rank ladder would invent a hierarchy the world lacks.
- **Alternatives rejected.** (a) Use-based skill bars: capture practice but lose the exam gates that close branches. (b) A year ladder: years are time, not power, so it would suggest strength where none is measured.

### MoL (Mother of Learning)

- **Unit and shape.** What you know and a mana reserve. Field, no rank (ADV 1; SPL 188, MND 140, loops 31).
- **How growth happens.** Mana shaping exercises raise the reserve; spells are learned by study and instruction; practice across a loop is kept as skill and memory because the mind persists (reader claims).
- **Branching and mixing.** Magic schools and divination are branches of study; there is no rank mixing. Spell mixing risk is spell-level (MND/ABL rows), not path-level.
- **Failure and loss.** Death resets the body and loop but not the mind; academy certification is a real exam with a pass rate (committed MoL pass).
- **Numbers.** Magnitude of the reserve is a second yardstick in dialogue; no stat window. Costs are felt as fatigue.
- **Who sees.** Teachers see certification; others see casting. A looper's reserve growth is hidden.
- **Self-knowledge.** You know what you have practised this loop and what carried over; exact reserve is a rough sense.
- **Default.** A loop notebook: facts and spells with known / practised marks, a reserve gauge, and a carry-over mark per entry. **Dial:** whether the gauge shows a number or only a felt word. **Reason:** the world has no rank, and the real question each loop is "what do I still have?"
- **Alternatives rejected.** (a) Report card: fits the academy exam only, and the looper's real growth is off the books. (b) Skill bars alone: they would reset in the player's head, but the book's point is that knowledge survives.

### SS (Shadow Slave)

- **Unit and shape.** A rank, a core of shards, an aspect, and a shelf of memories and echoes. Chain (ADV 273) plus a branching aspect tree.
- **How growth happens.** Trials in a dream realm and killing beings feed the soul; a rank is crossed through a trial and an aspect can evolve (reader claims; seam in `ascension_paths_ss.js` is bk-ss's work, not read here).
- **Branching and mixing.** Aspect evolution branches by what the character does; memories and echoes are a collection that adds abilities without moving the rank.
- **Failure and loss.** A trial can kill or corrupt; a flaw is a permanent cost; losing a memory loses its abilities.
- **Numbers.** The in-world system shows runes and attributes to the holder (ids `ss.ability.status-runes`, `ss.ability.aspect`).
- **Who sees.** The holder reads the window; others see rank by aura or by gap, not the numbers.
- **Self-knowledge.** High: the window is the character's own mirror, with unlearned entries shown as locked.
- **Default.** A status window: aspect and flaw, attributes with their words, a rank chain, and a shelf of memories and echoes. **Dial:** how much of the window the character can read (locked rows, partial attributes). **Reason:** the world itself gives the player a status window, so showing one is faithful and cheaper to read than prose.
- **Alternatives rejected.** (a) Plain ladder: loses aspect and collection, the parts that vary between characters. (b) Passive tree for everything: right for aspect evolution (kept as a detail view), wrong for ranks.

### GC (Godclads) *thin*

- **Unit and shape.** A body feature gained, grown or lost; no path (ADV 10; CRE 88; ABL 107; ids such as `gc.ability.haemophage-regeneration`, `gc.ability.ghoul-night-vision`).
- **How growth happens.** Change of body by consumption and adaptation, and by what a godclad-style gift does (inferred from ids; read the committed GC synthesis before building).
- **Branching and mixing.** Features can conflict or compound; the outcome is body change, not a rank penalty.
- **Failure and loss.** Loss is physical: a feature fades, a body breaks.
- **Numbers.** No rank scale is evident in the rows.
- **Who sees.** Others judge by what the body can do and how it looks; threat is read from the outside.
- **Self-knowledge.** You know what your body does; why it does so may be unknown.
- **Default.** A body dossier: a list of features by body part, each with a state (works, costs, fading) and no ranks. It reuses the body figure. **Dial:** how many features are named. **Reason:** nothing in the rows supports a ladder, and a list stays true when the world adds features.
- **Alternatives rejected.** (a) Ladder: would invent ranks (ADV 10 is nearly none). (b) Skill bars: the features are present or absent, not practised.

### PR (The Perfect Run) *thin*

- **Unit and shape.** A power and what a loop has taught. No path (ADV 0; ABL 362; ids `pr.ability.save-point`, `pr.ability.time-stop`, `pr.ability.enhanced-timing-sense`).
- **How growth happens.** Powers are gained and refined through the story's means (read the committed PR notes first); knowledge of the world accumulates across loops (loops slug 33).
- **Branching and mixing.** Powers can combine; the interesting edge is a combination, not a rank.
- **Failure and loss.** A reset loses what is not carried; a power can have a cost or a limit (ABL conditions).
- **Numbers.** None evident.
- **Who sees.** Powers are hidden by default; others see effects.
- **Self-knowledge.** You know your powers and their limits; true reach is learned by trying.
- **Default.** A power list grouped by source tag (gift, learned, item), each with limits stated, beside a loop notebook for what carried over. **Dial:** how much carries between loops. **Reason:** no rank text exists and the player's progress is knowledge and combinations.
- **Alternatives rejected.** (a) Constellation or passive tree: implies purchased nodes, while the powers here are given or found. (b) Status window: invents attributes.

### RI (Reverend Insanity)

- **Unit and shape.** A rank (Gu Master realm) with early, middle, upper and peak stages, an aperture that holds essence, Gu worms, and dao marks. Chain with substages (ADV 225) plus a field of dao marks.
- **How growth happens.** Cultivate essence in the aperture to fill the stage, then breakthrough at a bottleneck; Gu worms are refined and fed; the sect runs exams at fixed intervals (committed RI pass: 3-, 8- and 15-year exams, stated).
- **Branching and mixing.** Paths of dao are many; mixing paths is possible and costly (reader claims); Gu combinations are the real mixing, as killer moves.
- **Failure and loss.** Breakthrough can fail; a Gu can die; a rank can stall for years; death ends.
- **Numbers.** Ranks are numbered and said aloud; stone prices for Gu and stage are in the world (ECO 44).
- **Who sees.** Others read your rank by aura and by Gu; the aperture is private.
- **Self-knowledge.** High for stage; the bottleneck is felt.
- **Default.** A realm meter with a bottleneck gauge and a breakthrough moment, beside a vessel view (aperture and Gu) and a dao-mark field. **Dial:** how exact the meter is (named stage only, or a fill within it). **Reason:** the stage's partial filling is the game, and the vessel is the inventory.
- **Alternatives rejected.** (a) Plain ladder: loses substages and the bottleneck. (b) Passive tree: fits dao paths only, and RI's rank is not chosen.

### ASL (A Soldier's Life)

- **Unit and shape.** A rank in the legion, an essence intake, and a standing in a cohort. Chain (ADV 101) plus a leaderboard (SPL 283 for spells).
- **How growth happens.** Training, tablet and weapon rankings every few weeks, essence consumed from kills, promotion by office (committed ASL pass: tablet cut about every three weeks, bottom three go to the army, stated).
- **Branching and mixing.** A specialty or posting is a branch; essence types differ; mixing is an intake risk (COR 64).
- **Failure and loss.** Being cut ends a place; battlefield loss costs rank and body.
- **Numbers.** The tablet shows a ranking; essence has no stated number to the holder.
- **Who sees.** High: rank insignia are public and the tablet ranking is read by the centurion.
- **Self-knowledge.** You see your tablet standing and your own essence only as strength.
- **Default.** A service record: insignia and rank, a tablet standing within the cohort with the cut line drawn, commendations and the essence intake as a state. **Dial:** who can see it (a private view, or a posted board). **Reason:** the world publishes rank as a social fact, and the cut line is the pressure.
- **Alternatives rejected.** (a) Status window: the tablet is a window, but it shows standing, not a private attribute sheet. (b) Spell field: spells are 283 ids but rank and cohort drive daily play.

## 3. A character holding several systems

The character sheet glance line (CHARACTER_SHEET.md) gets one short line per held system, in that system's own words, capped at three then "and N more". Example for a LOTM Seer who also studied at an academy and carries a loop gift:

> Seer, rung 8, settling · Academy, Charms B, 3 spells fluent · Loop gift, 2 powers known

The abilities view groups by system, then by source (rung, learned, item, contract, cheat), and each group draws in its own form: ladder, report card, power list. A system with no known path shows as a list (valid shape `none`). Gallery mock `progression-multi-glance` shows the line and the grouping.

Captures (1920x1080, headless, effects off, both themes): [`evidence/progression/`](evidence/progression/). Mocks cover the status window (SS), report card (HP), loop notebook (MoL, PR), realm meter with vessel (RI), service record (ASL) and the multi-system glance. LOTM and COI reuse the shipped ladder fixtures; GC's body dossier reuses the body figure and is not mocked here. The ladder fill and ghost arc are drawn by the existing primitive; the realm mock's ghost arc is faint at this size and is worth a closer look before building.

## 4. Shared model needs (sent to `sw-adv` and `rep-abilities`)

For the path graph (round 6, G1-G7) every world's needs fit one superset:

| Need | Used by | Field |
|---|---|---|
| Several graphs at once | all | `system` on node; a character holds a set |
| Substages | RI | `tier` plus `substage` |
| Fill, quota, grade, standing, capacity, mastery state | LOTM, SS, HP, ASL, MoL | typed `metrics[]` |
| Numbers shown or felt | all | `numbersInWorld`: exact, felt-words, none |
| Survives a reset | MoL, PR, COI | `persistsAcrossReset` |
| Visibility to others | ASL, SS, LOTM | `visibleToOthers`: none, insignia, sensed, status |
| Branch, swap, mix, demote, learn edges | LOTM, SS, HP, RI | edge `type` |
| Failure outcome and signs | LOTM, RI, ASL | edge `outcome`, `signs`, `odds` |
| Keep or lock other branches | HP, SS | edge `locksOthers` policy |
| Valid no-path state | GC, PR | shape `none` with a source-tagged list |
| Knowledge levels 0-5 and rumour/confirmed/insight | all | node and edge `knowledge`, `provenance` |
| Trail after loss | LOTM, RI, ASL | history list with cause |
| Collections | SS | node kind `collection` |

## 5. Little details (within UR38)

- **Hover preview.** The ghost fill already shipped: hovering a planned act shows the dashed arc of what it would add, and its words.
- **Breakthrough moment.** RI and SS: a pulse on the new stage and a plain-text line stating what changed; no layout movement, off when effects are off.
- **Rank-up flourish.** One glow on the new rung, one logged line; no sound or modal blocks input.
- **Rumoured versus confirmed.** Unlearned nodes use the existing guessed state `~` with its word; confirmed use filled marks.
- **You are here.** Every form has the same marker word so the player never hunts for it.
- **Others' paths.** When known, a witness view shows the other character's visible standing only, never their private numbers.
- **Cheat and insight views.** A cheat or insight reveals more nodes and numbers, and the figure labels them "by insight" so a revealed fact is never mistaken for learned knowledge. Sealed secrets stay on their discovery route.

## 6. Tables

**ACT NOW (done in this round)**

| Item | Level | Effort | Done check |
|---|---|---|---|
| This doc and nine defaults | design | done | doc exists; each world has default, dial, reason, two alternatives |
| Needs list sent to sw-adv and rep-abilities | cross-lane | done | messages delivered 2026-10-30 |
| Five gallery mocks | prototype | done | `tests/progression_figure.test.js` passes; captures in `evidence/progression/` |

**ACCOUNT FOR NOW**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Doc stays proposal until Weibao picks | process | small | no line says "accepted" without his instruction |
| Mocks use raw figure specs, not the graph model | scope | small | fixtures do not import `ascension_paths` extensions |
| GC and PR rows are thin | evidence | small | rows re-read before any build |

**LATER / DELEGATE**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Graph shape in `ascension_paths.js` (`sw-adv`) | model | medium | validator accepts tree, field, none; ladders unchanged |
| Form picker by shape and world default (`rep-abilities`) | view | medium | view names no world id (ratchet P5) |
| Glance line per system on the character sheet | view | small | focused test with three systems |
| HP report card and spell field with real rows | world | medium | `bk-hp` consumes it, spell moves heard to fluent |
| MoL notebook with carry-over marks | world | medium | `bk-mol` consumes it after sw-death restart model |
| RI realm meter and vessel | world | large | a breakthrough crossing in a focused test |
| ASL service record with cohort cut line | world | medium | a cut changes a place in a test |
| Per-world nuance sweep when Worm, SSS and You Are Summoned are read | research | medium | each gets a row in section 1 |

## 7. Blanket-claim sweep

Every "no" or "none" above is a default with a reason for that world, not a rule for all worlds; a world's stated absolutes describe its ordinary case (AD5). The dial on each default is the place to change it.
