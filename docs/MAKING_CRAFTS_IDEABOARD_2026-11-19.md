# Making crafts ideaboard (2026-11-19, proposals)

Weibao, expanding I3 from the [ideaboard starter](gm/dispatch/play-surface-2026-11-14/HANDOFF.md#ideaboard-starter-2026-11-16-proposals-for-weibao-to-react-to): "expanding on gameplay content for each of our ideas? Ui to go along them?", then "forging, potioncraftin, inventing, more?" and "gated behind a item or something? location? purchase?"

Every MKC line below is a proposal (AD32). The "Now" lines come from a static read of the code on 2026-11-19: a code path exists, but nobody played it for this board.

## How a craft opens (the gating question)

**Default (MKC1).** A craft opens on what the making physically needs. Nothing is paid for to unlock a recipe.

That follows AD38 (things work by how they work), AD55 (costs follow the mechanism) and MR6/MR7 (experimentation is free and formulas are attractors, not gates). A purchase is fine when it buys a real thing, such as a formula sheet, a tool, ingredients or rented bench time. Any new hard limit goes to Weibao first (AD56).

**MKC2 · Seven kinds of gate.** Each craft names which of these it uses.

| Gate | What it is | Already in code |
| --- | --- | --- |
| Tool | An anvil, a cauldron, a carving knife, a refining vessel | YAIR station tiers raise success and quality (`crafting_recipes.js:86`) |
| Place | A forge, a lab, Hale's bench, a cave with primeval stones | Stations are tied to locations; the Tingen workroom |
| Knowledge | A formula, a book, a teacher, a witnessed method | Recipe `is_unlocked`; the LOTM formula purchase (`book_world_lotm_brew.js:31`); learning a method by watching (Cyoria) |
| Material access | A shop, a gathering spot, a contact who sells | Village verge herbs; LOTM materials |
| Standing | A licence, guild membership, a class enrolment, Nighthawk clearance | Harry's Potions class |
| Body | Essence in an aperture, a Sequence, a magical core, stamina | Gu essence; LOTM pathway eligibility |
| Money and time | Rent the bench by the hour, pay a master, wait for a brew | The LOTM formula at 5 pounds (scaled) |

**MKC3 · Before a craft opens, it shows.** Each craft the life could reach shows as one "Not yet" row in its place (PS304's fold), with the reason beside it (UR128) and the route to opening it, for example "Needs a forge · Smithy on Mill Lane, rents by the hour".

A craft the life has no hint of stays hidden. Knowledge rules decide what counts as a hint.

**MKC4 · Dial.** Gates are a comfort setting (MR18): Mechanism (default), Open (all benches usable, costs still apply) or Strict (adds canon standing such as licences and age limits).

## One bench, one loop

The current state:

- `src/ui/bench_form.js` draws five parts: Goes in, Room, Clashes, How sure and After.
- The rune bench is its one user so far.
- The gear workshop, the village experiments, Potioneering and the LOTM bench each draw their own markup.

The bench layout below follows Weibao's answer on the pending two-column bench and item-sheet proposal (HANDOFF, feature-ui). The board adds no new shell.

**MKC5 · Every craft on the same five parts, and a sixth row called Next.**

Next links the result onward: wear it, sell it, hand it in, drink it, give it, or take it to a second bench (PS55). That row is what makes I3 a loop rather than a set of separate benches.

**MKC6 · The loop has two holes, and they come before any new craft.**

- No fight reads a potion or dose (LAYX47, MR32).
- Crafted LOTM and HP products have no sell or order path.

Until both are fixed, making ends in a pouch.

**MKC7 · Engines with no player count as content.**

| Module | Unlocks |
| --- | --- |
| `brew_generation` and `brew_compose` | generated potions |
| `spell_invention` | spell invention |
| `gu_workshop` | a Gu bench |
| `weapon_riders` | weapon riders |
| `craft_assembly` packs `gear_ward` and `strike_enchantment` | wards and strike enchantments |

Wiring these to a bench gives play from work already done.

---

## Forging

**Now.** In the Village, YAIR's Forging and Smelting are in the Crafting window, and the gear workshop has 13 actions: heat, shape, quench, temper, reforge, socket, repair and the rest. Reforging shows the old and new values side by side (PS249). Weapon riders and corrosion never reach the screen.

**Way in.** Tool and place: an anvil at a smithy, with a field kit for repair only. Knowledge rises with skill and books, as in YAIR.

- MKC8: rent a forge by the hour before you own one.
- MKC9: in Tingen, no forge, but Klein can commission a smith and supply the materials (making by order).
- MKC10: at Hogwarts, no forge; Harry has repair charms and a broom-servicing kit instead.

**Add.**

- **MKC11 · Heat as a held state, not a button.** A billet cools between strikes. Strike while it is hot, return it to the fire, and accept that a late quench cracks the piece. An idle repeat keeps the rhythm going, and the player sets how far to push. This uses `craft_process_thermal`.
- **MKC12 · The piece remembers its making.** Quench medium, fold count and maker show on the item sheet as history. Riders from `weapon_riders` appear once known (ITM16).
- **MKC13 · Commissions.** A villager orders "a sickle that holds an edge through harvest". You choose the material and process, the client returns with a verdict, and your standing as a maker grows. This is a livelihood (LVR), not a quest marker.
- **MKC14 · Salvage as the reverse craft.** Break a piece down for part of its metal and a hint of how it was made. Knowledge flows back into the notebook.

**Bench.**

- Goes in: billet, fuel, flux.
- Room: heat left in the piece, as a meter that falls.
- Clashes: wrong quench for the metal.
- How sure: crack chance from the failure ledger.
- After: the stat sheet, old against new.
- Next: wear it, sell it, or take it to the rune bench.

**Done check.** Forge, quench and inscribe one weapon in the Village, then use it in a fight with the rider readable. Save, reload, export and import keep its history.

## Potion-making

There are three worlds with three different laws. One bench form stays, and the law changes underneath it.

**Now.**

- **Village.** YAIR Alchemy and the herbal experiments, with steep level, brazier heat, the experiment notebook and failure forecasts.
- **Hogwarts.** The Potioneering panel (stir direction, take off the heat, assay) and the fixed Cure for Boils class.
- **Tingen.** A formula bench with 161 formulas, and Corpse Collector is the one that can be brewed today. The Seer brew is watched, not made.

**Way in.**

| World | Gates |
| --- | --- |
| Village | Knowledge (books, a herbalist teacher) and material (gathering) |
| Hogwarts | Standing (class timetable, OWL level), material (the student kit, the Diagon Alley apothecary, Snape's stores as a risk), place (dungeon classroom; later the Room of Requirement or the girls' bathroom, as Polyjuice canon shows) |
| Tingen | Knowledge, bought or traded at Beyonder gatherings; material (the characteristic and supplementary ingredients, each needing a seller); body (the right pathway and Sequence to drink it) |

**Add.**

- **MKC15 · Hogwarts: the class as a timed bench.** The class runs a set number of minutes. Snape's eye falls on mistakes, and partner work splits the steps between you and the cauldron next to you. Homework brews outside class need your own kit and a hidden place. This turns the fixed procedure into play while the written steps remain the guide.
- **MKC16 · Tingen: the formula is a document you can doubt.** A bought formula can be incomplete or forged. You can test it by divination (Seer) or by paying for an appraisal, and a wrong formula warns of loss of control before you drink. This is knowledge as play (I6).
- **MKC17 · Tingen: brewing for others.** Once Klein can brew, Nighthawk colleagues and gathering contacts order potions. Money, standing and exposure risk move together. This gives LOTM products their sell path (MKC6).
- **MKC18 · Village: wire `brew_generation` to the Mixing counter (SFC41).** New combinations produce named potions with true properties that act before you know them (MR1).
- **MKC19 · A potion in a fight.** A drink, thrown vial or coated blade enters the fight as an action, with its real dose and onset (MR32). This one item closes the loop for all three worlds.

**Bench.**

- Goes in: ingredients by role.
- Room: the cauldron's state (heat, colour, stir count).
- Clashes: an antagonist pair.
- How sure: the assay, or "unknown" with how to find out.
- After: doses, potency, shelf life.
- Next: drink, fight belt, sell, hand in.

**Done check.** For each lead, brew one potion they chose, then use it in a fight or hand it in, with browser proof on a fresh origin.

## Inventing

**Now.** Zorian's research in Mol is three pack commands: the shelf, the sealed-box trials and the write-up. `invention_planner`, `invention_qa` and `spell_invention` run headless with no bench.

**Way in.** Knowledge first: you can only invent next to something you already understand. Place: a workshop or study. Time: invention is the slowest craft.

- MKC20: in the Village, a tinker's shed that unlocks after you repair one machine.
- MKC21: at Hogwarts, spell invention opens after the Half-Blood Prince's notes, or Fred and George's shop route.
- MKC22: in Mol, Zorian's loop is the time gate itself; each restart keeps the knowledge and loses the materials.

**Add.**

- **MKC23 · Invent by hypothesis.** You state what you want, such as "a lamp that burns without oil". The planner proposes three paths from what you know, and each trial costs time and material and teaches whether that path holds. A failed path is written in the notebook as knowledge, not lost.
- **MKC24 · Inventions spread.** A working invention can be shown, sold as a design or kept secret. Shown, it changes the market and may draw imitators. Kept secret, it pays you alone.
- **MKC25 · Spell invention on the same form (SFC42).** You choose effect, shape and focus from the effect grammar; trials risk mishaps; the result is a spell you can teach.
- **MKC26 · Danger lint as play.** `invention_danger_lint` warns before a trial ("this mix can explode"). You can heed the warning or test anyway at a cost.

**Bench.**

- Goes in: known principles and parts.
- Room: the number of open hypotheses.
- Clashes: principles that contradict.
- How sure: the planner's confidence, and why.
- After: a working model, or a written-up dead end.
- Next: patent or sell, teach, build more.

**Done check.** Zorian invents one thing over the loop, and it survives the reset as knowledge.

## More crafts

**MKC27 · Enchanting differs by world (PS250).**

| World | Craft | Now | Gate |
| --- | --- | --- | --- |
| Village | Runes | Playable | Open now |
| Tingen | Charms and rituals: amulets as authored commands, rituals that call on a name or a power | Amulets, as authored commands | Knowledge, and the risk of the power you invoke |
| Gu | Refinement of a living thing (MKC28) | Two buttons | Below |

All three use the bench form. Only the Clashes and How sure lines change meaning: rune pairs, a ritual's response, a Gu's will.

**MKC28 · The Gu refine bench (D4, SFC43).** The current state is two buttons ("Refine", "Cow it"); `gu_workshop` has no player.

The gate is body (primeval essence in the aperture), material (the Gu's food and refinement ingredients) and place (a safe cave, not the clan's eye).

What to add, building on the missing conditions, odds, will contest and defeat-into-submission found in [refinement, will and canon time](audits/REFINEMENT_WILL_AND_CANON_TIME_2026-11-14.md):

- Choose the refinement materials.
- Hold essence steady while the Gu resists.
- A failure loses the Gu, or worse.
- A success needs feeding afterwards.

**MKC29 · Gu keeping as making.** Feeding, housing and breeding Gu so they grow or combine. The bench shows hunger and temperament, the colony and what each Gu eats. It ties into the keeper life (I7).

**MKC30 · Cooking as its own bench.** Village Cooking leaves the Crafting list. Meals carry real effects (warmth, stamina, mood) and a household dinner for others raises ties. Klein's Moretti dinners and the Hogwarts table become places where you are served, not where you cook. Hunger stays off by default (XC19).

**MKC31 · Wandlore (unusual).** At Hogwarts you cannot make wands. You can learn to read them: wood, core and length tell you about the owner, and the wand may shift its allegiance after a duel. This is a craft of knowing, not of making. It shows that one bench form also fits appraisal.

**MKC32 · Making as a life (unusual).** One lead whose whole day is a workshop: a Tingen artisan who makes amulets for paying clients and gets drawn into the occult through an order. It uses the same screens and proves that making can carry a life. It pairs with I7.

---

## One loop in every world (round 2, 2026-11-19)

Weibao, asked which world gets the first full loop: "Make it applicable to all of them, just consioder different types in different worlds due to having different capabilities and more?"

So the loop is one shared spine, and each world fills its steps with the kind of making its laws allow. The board sorts by mechanism, not franchise (SC4 in the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md#sectioning-by-mechanism-not-by-franchise-2026-11-12)). Who makes what in about 30 worlds is already in [maker arts by world](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md) (W01-W19, B01+). This round reuses those rows and does not re-derive them.

### MKC33 · The spine: eight steps every craft passes through

| Step | What happens | Bench part |
| --- | --- | --- |
| 1 Learn | A teacher, a book, a witnessed method, a bought formula, or your own trial | Not yet row with its route (MKC3) |
| 2 Get in | The craft's gate opens (MKC2) | Goes in, greyed until met |
| 3 Gather | Find, buy, grow, hunt or salvage the inputs | Goes in |
| 4 Work | The world's process: heat, stir, carve, feed, cast, reason | Room and Clashes |
| 5 Know | Assay, appraise, test, divine, or stay unsure | How sure |
| 6 Use | Wear, drink, throw, cast, plant, release | Next |
| 7 Pay off | Sell, fill an order, hand in, gift, gain standing | Next |
| 8 Return | Repair, refine, salvage, teach, improve the method | Next, back to step 1 or 4 |

A world can skip or merge steps when its law does. For example, a Gu is fed rather than repaired. The bench then shows the step the world uses, not an empty one.

### MKC34 · Eight kinds of making, by how they work

| Kind | The law | What can go wrong | Where it lives |
| --- | --- | --- | --- |
| K1 Shaping matter | Heat, force and material decide the result | Cracks, warping, a bad temper | Village forge, Frontier yard, D&D smiths, Mistglass sword refining |
| K2 Mixing | Doses and reactions; the method matters as much as the list | A wrong reaction, a weak or toxic batch | Village herbal and Alchemy, Hogwarts potions, D&D alchemist's supplies |
| K3 Power in the ingredient | A part of something powerful carries the power; the maker risks the user | Loss of control, a corrupted item, a sealed artifact | LOTM potions and mystical items, monster-part gear (B02) |
| K4 Living making | The thing has a will and needs; you refine, feed and keep it | It resists, starves, dies or escapes | Gu refinement and keeping (B03), familiars, golems that learn |
| K5 Pattern | Geometry, words or symbols bind an effect to a carrier | Bad geometry, a clash between patterns, a drained battery | Village runes, Mol formulas and wards (W03), D&D scrolls, Naruto tags (W06) |
| K6 Borrowed power | A power answers a ritual, a name or a vow | It answers wrongly, takes a price, or notices you | LOTM charms and rituals (W13), JJK vows (W04) |
| K7 Bond | Making the blank differs from the owner's bond with it | The item refuses the user or changes allegiance | HP wands (W01), Bleach blades (W05) |
| K8 Knowledge | The product is a method, design or spell, not an object | A dead end, a stolen idea, a dangerous discovery | Invention, spell invention, Zorian's research, wandlore appraisal |

Each kind is one law module over the shared bench. A world turns kinds on and dials them. The bench's Room, Clashes and How sure lines take their meaning from the kind.

### MKC35 · Every world's loop

| World | Kinds | Signature make | Opens on | Used for | Who pays | Live today |
| --- | --- | --- | --- | --- | --- | --- |
| Village | K1, K2, K5, K8 | A forged and rune-inscribed weapon; a herbal draught | Station and skill (YAIR), books | Fights, the long road | Traders, villager commissions (MKC13) | Forge, gear workshop, rune bench, experiments |
| Frontier | K1, K2 | Fitted braces and tools; reed oil on a blade | Yard work, bought vials, the old craftsman | Field work, survey trips | Yard and survey contracts | Fieldcraft and cooling refinement packs |
| Mistglass | K1 | A refined sword | A carried sword and condensate | Fights | Inference: collectors | One refine verb |
| Tingen (Klein) | K3, K6, K2 | A Beyonder potion; an amulet; a ritual | A formula from a gathering, a pathway and Sequence, a hidden room | Advancement, protection, fights | Colleagues' and contacts' orders (MKC17), Klein's clients | Corpse Collector brew, amulet commands |
| Hogwarts (Harry) | K2, K7, K8 | A class potion; a homework brew; a spell variant | The timetable, the student kit, the apothecary, a hidden place | Grades, house points, friends, fights | Teachers by grade; Fred and George's shop route | Potioneering panel, Cure for Boils |
| Gu (Fang Yuan) | K4 | A refined Gu; a fused Gu | Primeval essence, refinement stock, a safe cave | Fights, the aperture's growth | The clan market, Gu trades | Two action cards |
| Gu keeper | K4 | A fed, bred, housed colony | The house and its food | Colony output, sale | The market (the potato market pack) | Keeper packs |
| Mol (Zorian) | K5, K8 | A ward; a formula; an invention | Study, a teacher (Nora, Edwin's workshop), the loop | Surviving the loop, leverage | Classmates, the guild (inference) | Three research commands |
| D&D | K1, K2, K5 | A shield; a potion of healing; a scroll | Tool proficiency, Arcana, materials, days of work (WQ4) | Adventures, attunement | Phandalin townsfolk, the party | Rule ledgers, no bench yet |

The other rows in maker arts by world (JJK, Naruto, Bleach, FMA, Shadow Slave and the rest) join by naming their kinds and filling one row like these.

### MKC36 · The bench reads by world (UI)

The bench uses one form, and the kind changes three things:

- **The Room meter.** K1 heat left in the piece, K2 the cauldron's state, K3 the mind's stability, K4 essence held against the Gu's will, K5 space left on the carrier, K6 the ritual's attention, K8 open hypotheses.
- **The verbs in the Work step.** Strike and quench, stir and add, feed and press, carve, chant, state and test.
- **How sure in its own words.** "Assay says", "the Gu resists", "the spirit is listening", "the planner thinks".

What stays fixed: Goes in on the left, the process in the middle, After and Next on the right. That way a player who learned one bench reads every bench. The bench face can carry the world's look when PS312 (a look per world) is chosen.

### MKC37 · A Making page per life

The Journal gains one page per life called Making. For each craft the life knows of, it shows:

- the craft's state (open, Not yet with its reason, or practised to some level)
- the methods learned
- orders waiting
- the last few makes, with what became of them

This replaces hunting for benches across Here. Each row links to its bench, and a Not yet row links to its route.

### MKC38 · Made things cross worlds by the place's law (I4)

A made thing keeps the law it was made under. Whether it works abroad is decided by the edge (XWR10, place rules by default):

- A forged blade (K1) works anywhere.
- A Village rune tablet (K5) works where its pattern law holds.
- A Beyonder potion (K3) works on any body able to take a characteristic, and is dangerous to any other.
- A Gu (K4) needs essence to activate, so in a world without primeval essence it lives but sleeps.
- A Hogwarts potion (K2) holds where its magic holds. The edge decides that.

The item sheet says which applies before the crossing (XWR8). Goods cross as conserved stock (XWR9).

### MKC39 · Ingredients from another world (unusual)

What one world makes, another may use. Some examples:

- A Gu's corpse as a Village alchemy reagent.
- A Village rune carved onto a Tingen amulet blank.
- Hogwarts dittany in a Gu Master's wound.

Each pairing is tested by the two laws, so its result is unknown until tried (MR1). That makes it a reason to cross. It pairs with I4 and stays behind the gates of both worlds.

### MKC40 · Who else makes

NPC makers in each world work the same loop on the same law: the Tingen artisan, Ollivander, the clan's refinement staff, Edwin's golem shop. That has three effects:

- A player can buy from them, order from them, apprentice to them, or compete with them.
- Prices follow how hard the making is.
- Your commissions take buyers from them, and they notice.

It reads from the economy (ECR) and ties (TIE), and keeps NPC records under the same law.

## Round 3, 2026-11-19: Gu, spellcraft and more to consider

Weibao: "more to consider? save and extend accordingly, Is gu both crafted and raised/bred? Spell craft?"

### Is Gu both crafted and raised? Yes, five ways (MKC41)

In Reverend Insanity a Gu is a living individual. The game already treats it as one: a claim keeps the same specimen id, traits and provenance (MR44 in `gu_refinement.js`). There are five ways to make or keep one, and they differ in mechanism:

| Way | What happens | Canon shape | In code |
| --- | --- | --- | --- |
| G1 Claim | You catch a wild Gu and refine your will into it until it is yours | Fang Yuan's wild-Gu refinement; it can resist and fail | `gu_refinement.js` claim in place; the "Refine the wild Gu" card |
| G2 Fuse (crafting proper) | A recipe consumes Gu and materials to make a different or higher-rank Gu | Refinement recipes; failure destroys the inputs | `gu_moon_fusions.js` (rank 2 from furnace stone, lineage recorded), `gu_keeper_fusion.js` |
| G3 Raise | Feed it its own food at its own interval, house it, keep it alive and growing | Each Gu has a diet; some starve without food | `gu_catalogue.js` diet, interval, ration and starves fields |
| G4 Breed or propagate | Some Gu multiply: plant and harvest, or a colony produces its own kind | Thunder potato plots; an ant queen that makes black ant Gu monthly and starves without them (ch1129-1130) | `gu_propagation.js`, `gu_keeper_propagation.js`, `gu_colony.js` |
| G5 Compose | Several Gu used together as a killer move: the Gu world's spellcraft | Fang Yuan deducing and improving killer moves | `gu_move_generation.js`, `gu_keeper_move_trial.js`, the [killer moves considerations](GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md) |

So K4 splits in two. G1 and G2 are one-off makes on a bench (MKC28). G3 and G4 are ongoing keeping, so they belong in a place rather than on a bench.

**MKC42 · The Gu house is the K4 keeping surface, not a bench.** It shows each Gu (or colony):

- what it eats and when it is next due
- its stock of food
- its temper
- what it produces

This builds on `gu_house_view.js` and the keeper packs. The bench is for the moment of making; the house is for the weeks after.

**MKC43 · Upkeep across idle time.** A raised Gu eats while you are away, and that is the main idle consequence of K4. Default: food in the house is drawn on its interval. When stock runs short, the Gu that would starve first is named in "While you were away" (PS311), and a feeding queue can be set beforehand. Per AD55 there is no starvation unless the Gu's diet records it (the `starves` field). Dial: a keeper who owns the stock can automate the feeding, at a cost in food.

**MKC44 · Fusion consumes living individuals.** The bench names each input Gu, with its history, before you commit. A failure says which inputs died. The result is a new individual with lineage recorded (`recordLineage`), and the descent graph (DG in the [foundation plan](PROCEDURAL_FOUNDATION_PLAN.md)) can show its ancestry.

**MKC45 · Breeding for traits (unusual).** Where a Gu propagates, offspring inherit force and trigger with spread (`inheritedLevel` in `gu_propagation.js`), so selective breeding is possible. Keep the best fruit, replant it, and over seasons a strain drifts. Sold strains carry their keeper's name. It pairs with heredity (GN) and makes the keeper life a breeder's life (I7).

### Spellcraft: a ninth kind of making (MKC46)

A spell is a made thing that you carry in skill rather than in a pack. It is made by invention (K8), it can be stored on a carrier (K5), and it is performed through the body. The depth list is already written (SPD1-SPD9 in the [foundation plan](PROCEDURAL_FOUNDATION_PLAN.md#spellcraft-depth-spd)), and the engine exists (`spell_invention.js`: recombine and transfer, with the five checks "it runs, pays, is allowed, explains itself, is worth keeping"). Neither has a player.

**K9 Performance.** The product is a repeatable act: a spell, a killer move or a technique. It is learned, practised and improved. It can fail as a fizzle, a backfire or a misfire (SPD4).

| World | Spellcraft there | Opens on | First slice |
| --- | --- | --- | --- |
| Hogwarts | Incantation, wand movement and intent (SPD1); students invent spells (the Prince's notes) | A wand, classes, then the notes or your own research | Vary a known charm's reach or target; one invented spell for Harry's years |
| Mol | Formula geometry plus spell-shaping exercises (SPD3, W03) | Study with Nora's exercises; the loop keeps the skill | Shaping drills that raise precision and efficiency as trained numbers |
| Gu | Killer moves (G5) | Owning the Gu, and essence for all of them at once | Compose two owned Gu into a move and test it |
| D&D | Spell slots; scrolls as K5; spell research as an optional rule | A class with spellcasting; scribing needs Arcana and time (WQ4) | A scroll scribed from a prepared spell |
| Tingen | No spell invention for Klein in canon; Beyonder powers come from the potion, and rituals are K6 | A pathway | No K9 bench; ritual design sits under K6 |
| Village | The existing fight techniques (`techniques.js`) | Training | Learned fight habits (PS221) as a K9 practice curve |

**MKC47 · One spell record, three owners avoided.** A spell has one record: its effect sentence, cost, components and inventor. Each use reaches that record in its own way:

- The invention bench (K8) writes it.
- A scroll, ward or tag (K5) points to it.
- The caster's skill curve (SPD2) holds practice against it.

Reason: AR3 (one authority per fact). Three copies would drift apart when one is improved.

**MKC48 · Practice is the idle loop of spellcraft.** Repeat ×n on a spell raises reliability, power and speed on separate curves, with a plateau per spell and rust without use (SPD2). A bench is not the right surface for this. It lives in the existing Skills box, with the practice curve and the next plateau shown.

**MKC49 · Teaching a made spell.** An invented spell can be taught, sold as a written method or kept secret. That works the same way as inventions (MKC24) and gives spellcraft a Pay off step. A caster's signature style passes with teaching (SPD7).

### More to consider (ranked by consequence)

**ACCOUNT FOR NOW: constraints on any build from this board**

- **MKC50 · Item history versus save size.** Per ITM1, a stack becomes individuals once something attaches. If every batch of draughts carries its making history, stacks split and the save grows, which matters against the 8 GB target. Default: history attaches to notable makes (weapons, Gu, signature potions, anything named), while consumable batches share one batch record with their count. Dial: per item kind.
- **MKC51 · The combat wiring has a live owner.** MKC19 (made consumables in fights) touches the tempo-fight and combat files that are uncommitted in the primary checkout today (`src/tempo_fight*.js`, `src/models/combat.js`). Default: MKC19 goes to the combat lane as one item, or waits for its merge. One writer per area.
- **MKC52 · Persistence for the new records.** Methods learned, orders, making history, Gu houses and the Making page each need a namespaced save slice (AR rules), plus a migration or an explicit compatibility decision. Old saves are disposable for now, which is the likely decision, but it has to be stated per slice.
- **MKC53 · True properties stay sealed until known.** MR1 says true properties act whether known or not, and ITM16 says screens show what is known. The bench's How sure line and the item sheet read from what the life knows by default, not the true value (reason: MR1 and ITM16). That includes LOTM sealed artifacts, whose truths are sealed in play. A dev inspector may show both (MKC57).
- **MKC54 · Depth is a comfort setting.** MR18's quick, guided or deep applies per kind. Harry's class brew is guided, a Village experimenter goes deep, and quick is a one-click repeat of a known method. The bench shows the dial.
- **MKC55 · The game MCP must see making verbs.** Headless play reaches what the action collection registers. Each bench's verbs register there, so agents can verify loops without a browser and the AD43 browser proof stays the final gate.

**LATER / DELEGATE: ideas held for later**

- **MKC56 · Prices under orders and cross-world trade.** Commissions plus NPC makers (MKC40) and cross-world ingredients (MKC39) can open arbitrage: buy cheap in one world, sell dear in another. Buyers value goods by their own rules (XWR3, EC4), and goods are conserved across a crossing (XWR9). Run one economy check before MKC39 ships.
- **MKC57 · A making inspector (dev view).** For each craft, it shows the gate state, the law module (kind), true against known properties and the failure ledger. Default: it inspects only, any mutation goes through the existing dev cheat path, and it writes nothing to the save. Reason: inspection should not change what it inspects.
- **MKC58 · A lineage of methods.** A method learned from a teacher records who taught it, and a variation you improve becomes your own line (LN4, SPD7). The Making page can show it.
- **MKC59 · Making while away, for every kind.** Brews finish, billets cool, Gu eat, spells rust. One "while away" rule per kind (MKC43 is K4's) keeps idle time consistent with ACR1-ACR14 (compress repetition, keep real costs).

## Round 4, 2026-11-19: the first slice built, and what building it taught

Weibao: "more to consider? save and extend accordingly Implment ang ive them Ui? more to consider?"

### Built: the Next part on the Village benches (MKC60)

The first piece of the spine is in the source, uncommitted. It covers MKC5 and MKC33's steps 6 to 8.

- `src/ui/bench_form.js` draws a sixth part, Next, when a bench passes `next` rows. `renderBenchNext` draws that part on its own.
- `src/making_next.js` derives the rows from the current state, so nothing is saved and a reload re-derives them. A route the life has not found reads "Not yet: ..." with its reason beside it (MKC3).
  - The rune bench and the gear workshop open as the center view, as their navigation routes do.
  - Inventory opens in place, as its route in `layout_spec.js` says.
- **Rune bench.** After carving, Next shows:
  - "Fight while the tablet is worn" with the time left.
  - "Fight with the charged strip" with its charges.
  - "Work the blade you fight with" (the gear workshop), or "Not yet" with "Visit a forge to work on gear." when the life has not found it.
- **Gear workshop.** Its three sections are unchanged, because its layout waits on Weibao's bench answer. With a carried item chosen, a Next strip shows "Wear it", "Carve a rune tablet to fight with it" and "Sell it".
- **Not touched.** The herbal experiments already have "Drink one" on each preparation. Their sell path and any fight use are unverified, so they get no Next rows until a buyer or a fight reads them (MKC6, MKC19).

**Checks, all agent-verified and not human-reviewed:**

- `node --test tests/making_next.test.js tests/rune_bench_form.test.js tests/gear_workshop.test.js`: 23 pass, 0 fail.
- `check:player-text` and `check:docs` pass for these files.
- `tests/ui_contract.test.js` and `check:arch` fail on other lanes' uncommitted files, not this slice's: `combat_situation_ui.js`, `combat_versus.css` and `main.js` growth. None of the failures is in this slice's files.
- **Browser proof.** HEAD plus this diff and nothing else, rebuilt in a scratch worktree (since removed), headless Chrome at 1920×1080 from a fresh origin, Village fixture `frontier-hunt-ready` with dev-seeded wood and an iron sword.
  - Before carving, Next says what to do.
  - After carving ember then gale, Next offers the fight (it opens Here) and the forge.
  - Save, then load on a fresh page, gives the same Next.
  - The gear workshop's Next shows the three routes for the chosen sword.
  - No page errors.
- **Not exercised.** Export and import, because the slice adds no saved state. Hand play.

Evidence: [rune bench capture](representations/evidence/making/rune-bench-next-1920.png), [gear workshop capture](representations/evidence/making/gear-workshop-next-1920.png), [proof script](representations/evidence/making/next_proof.cjs).

### Corrections to earlier rounds

- **MKC61 · The Gu house exists.** The round 1 survey missed `src/ui/gu_house_view.js`, which already draws the keeper life's aperture gauge, per-Gu feeding timers, a firefly bed and the Liquor Worm's phases. MKC42 builds on that view; it does not add a new one.
- **MKC62 · A Spellbook panel exists.** `src/spellbook_ui.js` registers `spellbook`. MKC48 (spell practice) should check whether its practice curve belongs there or in Skills before choosing.

### More to consider, from building (ranked)

**ACCOUNT FOR NOW: constraints for the next slices**

- **MKC63 · Each route opens the way its route table says.** Inventory opens in place and benches expand. Default: Next reads `routeById` in `layout_spec.js`, so a route is never opened two different ways. This slice already does that.
- **MKC64 · Next rows are offers, not proofs.** "Sell it" sends you to Here whether or not a trader is present. Default for the next slice: a row that needs a counterpart (a trader, a client, a fight) is "found" only when Here has one, and otherwise it reads "Not yet: no trader here".
- **MKC65 · A cached panel goes stale.** The rune bench redraws only when its own state changes. Default: a Next route's found state is part of the redraw key, and this slice adds the forge's. A time-left fact refreshes with the panel's existing worn line, so both stay equally fresh.

**LATER / DELEGATE**

- **MKC66 · Keyboard focus for in-place routes.** "Wear it" shows Inventory, but focus stays on the button because the Inventory list has no focusable control. That belongs to ui-cohesion's Inventory pass: give a revealed module's heading focus.
- **MKC67 · Next after the work, not before.** The gear workshop shows Next as soon as an item is chosen. After a process runs is the stronger moment. Option: lead with the item just worked (the `fresh` mark already tracks it).
- **MKC68 · The next slices, each with its own owner:**
  - **G2 Gu fusion on the shared bench form.** Reads `gu_moon_fusions.js` and `gu_refinement.js`; feature-ui's D4 Refine bench.
  - **MKC48 spell practice.** Spellbook or Skills.
  - **MKC37 Making page.** Waits on ui-cohesion's Journal tabs.
  - **MKC19 potions in fights.** The combat lane, after its merge (MKC51).
  - **MKC64 counterpart-aware Next.**

## Round 5, 2026-11-19: crafting that plays like crafting

Weibao: "Right now crafting and stuff can be more gaified since righr now it feels like a series of dropdowns instead of crafting? can we pull ui from mods and more? more to consider?"

He is right, and the rules already agree.

- The gear workshop is eight selects ([capture](representations/evidence/making/gear-workshop-next-1920.png)).
- The Crafting window is a list with a detail pane.
- UR93 says a surface's layout encodes the mechanism's real structure, not generic rows. UR98 says a mechanism gets its own form (altar, vessel, body chart) built on the figure primitive.
- FE1-FE7 in the [crafting and consumables considerations](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md#fe-how-crafting-feels-to-play) already proposed an ingredient-path map, a synthesis grid, learning by tasting, failures that are content, active and idle modes, and small process choices.
- PS253-PS260 brought in the mods' information patterns: recipes on a key, hover state cards, effect previews, visible machines.

What has never been designed is each kind's bench as a thing you handle. That is this round.

**MKC69 · Patterns, not ports.** Each source below enters through the question it answers (PS261), drawn in our tokens and figure primitive (UR98). It is never a copy of that game's screen, art or layout. Most sources are Minecraft mods and crafting-heavy games; "my knowledge, not verified this session" applies to every source description below.

### MKC70 · One bench, three layers of hands-on

Every bench offers the same three ways in, set per bench and remembered. This is MR18's depth dial made visible.

| Layer | What you do | Who it is for |
| --- | --- | --- |
| Quick | One click repeats a known method, or queues ×n for idle | The method you already own |
| Guided | The bench walks the steps in order and shows each one's effect as you go | Learning a recipe, Harry's class |
| Hands-on | You handle the process: strike while hot, stir to a mark, hold the Gu's will | Getting better results, finding new ones |

Hands-on raises control (precision, yield, a quality band) and never truth (MR "mastery improves control rather than truth"). Skipping it costs only that bonus, never the make (AD55). Every hands-on action has a keyboard and no-timing equivalent (UR53, reduced motion).

### MKC71 · Each kind's bench, as a thing you handle

| Kind | The bench you see | What you handle | Patterns it borrows |
| --- | --- | --- | --- |
| K1 Forge | The piece itself, drawn as a silhouette with its real parts (head, edge, handle, binding) from `gear_work` components. Beside it an anvil strip: the billet's heat as a colour band cooling in real time, with a quench trough and a whetstone. | Click a part on the silhouette for its variants, each with stat deltas, instead of choosing from a "Component" select. Strike while the band is in the working range; return it to the fire; drag it to oil or water to quench. | Tetra's workbench (the item's schematic with clickable slots and per-slot variants and deltas); Tinkers' part builder (parts on a tool outline, stats per part); Tinkers' smeltery (molten layers in a tank) for smelting |
| K2 Mixing | A vessel in cross-section with its layers, heat underneath, and an effect map beside it: the brew as a dot moving through the property space as you add and stir. Known recipes are named regions on the map: formulas as attractors (MR7). | Drop ingredients in; turn a stir dial; work the bellows for heat; stop when the dot sits in a region. A grinder or knife step before adding where the recipe reads it (FE7). | FE1's ingredient-path map (Potion Craft's core idea, drawn in our own form); Thaumcraft's crucible (contents shown as aspect tallies); Kingdom Come's alchemy (follow a written recipe step by step) for Guided |
| K3 Power in the ingredient | A rite circle with its ingredient positions and the mind's stability as a ring that frays. | Place the characteristic and the supplementary ingredients in their positions; the ring shows the risk before commit (UR95). | Thaumcraft's infusion altar (pedestals and an instability readout); Blood Magic's ritual layouts |
| K4 Gu: fuse | A fusion chart: owned Gu as cards, two or more slotted in, the predicted result shown, or "?" where the life does not know the recipe (MR1). | Drag Gu into the slots; the ingredient materials go below; a will tug-of-war bar while refining. | Demon-fusion charts in monster-collecting RPGs (inputs to a predicted result); a refine tug as a short hold-and-release |
| K4 Gu: keep | The Gu house (MKC61) as pens: each Gu a card with hunger, temper, food stock and output. | Feed by dragging food onto a card; queue feeding for idle (MKC43). | Ranch and pen screens in creature-keeping games; Create's visible machines (the colony producing) |
| K5 Pattern | The carrier itself: a wood tablet with its rune slots, links between neighbours lighting up for known pairs and showing "?" for untried ones. | Carve by clicking runes onto the tablet in order (the strip exists; it gets a form). | Thaumcraft's research web (link known aspects into new ones) for learning pairs; Botania's runic altar for the carving moment |
| K6 Ritual | An altar with offerings, the invocation as ordered steps, and the power's attention as a rising meter. | Set offerings, speak each step; the attention reacts before commit. | Botania's petal apothecary, Thaumcraft's infusion |
| K8 Invent | A board of principles you know, as nodes; a hypothesis as a line you draw between them; trials pin results onto the board. | Draw a link to state a hypothesis; run a trial; a dead end greys and stays as knowledge. | Thaumcraft's research minigame (connect known to unknown); programming puzzle games for the build-a-mechanism feel |
| K9 Spell | A spell as a short sequence of glyph slots: form, effect, augments, with its cost bar filling as you add. | Drop glyphs in order; cast once to test; practise to raise its curve (MKC48). | Ars Nouveau's spell book (form, effect, augment glyphs); wand slots in roguelites (a sequence that fires in order) |

### MKC72 · What every bench shares (the feel)

- **A held-object moment.** The made thing lands in a result card with its quality band, its maker's name and "new" if it is a first make. Settle motion stays within reduced motion (UR99).
- **Ghost previews (AppleSkin, PS255).** Hovering an ingredient or a part shows where the brew moves, which stat changes, or how the ring frays, before you commit (UR95).
- **Recipe book on a key (JEI, PS253).** Any item shows its recipes and uses. A known recipe's region on the K2 map is the same fact drawn differently.
- **Discovery is an event.** A first-time result, a newly known pair or a new map region writes into the notebook with a mark (FE4). Failures are named things you can use (FE5).
- **The machine works where you can see it (Create, PS257).** A long brew bubbles, a billet glows, a colony moves. Each animation reads a real process variable (FE7, "no empty controls").
- **Next (MKC60)** closes every bench.

### More to consider (ranked)

**ACCOUNT FOR NOW**

- **MKC73 · Idle first, hands-on second.** This is an idle game, so the best long-run output has to be reachable by Quick and queues. Hands-on gives a capped bonus and is how you discover; it is never a chore you must repeat to keep up. Default cap: hands-on lifts one quality band, and discovery comes from both layers.
- **MKC74 · Controls read real variables.** Every handle (heat band, stir dial, tug bar) maps to a variable the law reads: `craft_process_thermal` for batches, the forge's hot window, hardness and toughness in `gear_work.js` (MKC106), the brew's stage, the Gu's will. A control that changes nothing is cut (FE7, MR16).
- **MKC75 · One figure primitive, many forms.** The forms are compositions on the shared figure primitive and kit (UR94, UR98, PS243-PS246), not nine bespoke renderers. Default: build one form (K1 forge) on the primitive first, and extract what the second form needs.
- **MKC76 · Cheap to draw.** The target is older 8 GB machines. Forms are SVG and CSS with settle motion, redrawn on state change rather than per frame. A canvas is welcome where it buys something (UR99), noted with its cost.
- **MKC77 · The gear workshop's layout is Weibao's open question.** Round 5 is a proposed answer to the pending bench layout item in HANDOFF: the silhouette and anvil replace the two-column form. It needs his look before it replaces anything.

**LATER / DELEGATE**

- **MKC78 · Prototype before building.** Use a disposable, runnable comparison (the `prototype-to-decision` route and the existing `prototypes/workbench`) of three K1 forge forms on real gear data:
  - (a) the current form with the Next strip;
  - (b) silhouette plus anvil strip;
  - (c) silhouette plus a heat-timing hands-on layer.
  The question it answers: which reads as crafting while staying fast for repeat work. Sonnet-level work, about one session, done when the three variants run on one carried item with screenshots.
- **MKC79 · The K2 effect map needs axes from the law.** `brew_law` and the brew engine carry properties; the map's two axes have to be a projection of real properties per world, not invented directions. Settle that before drawing it.
- **MKC80 · Sound.** A hammer strike, a bubble, a Gu chirp. Sound reads settled events and decides nothing (UR91), with a mute default per the Look registry.

## Round 6, 2026-11-19: one way of making, many worlds (reimagined)

Weibao, on round 5: "There has to be better and more cohesive? more to consider? complexity and more?"

### What is wrong with round 5 (MKC81)

Round 5 gave each kind its own screen: a silhouette, a vessel and map, a rite circle, a fusion chart, a tablet, an altar, a board and a glyph row. That would be nine things to learn, and each would be shallow, because its depth lives in a one-off drawing. Today's selects have the opposite fault: one shape everywhere, and none of it feels like making.

The assumption producing both: **the unit of design is the bench screen.** A screen per kind gives variety without cohesion. A form per kind gives cohesion without play.

The code already answers this better than either:

- `making_procedure.js` compiles ordered steps onto simulation jobs. Completed steps stay facts across cancellation and reload.
- `dose_process.js` is one process envelope (slots, minutes, bench, ritual, gaps) for "a potion, a pill, a smithed blade or a meal".
- The gear workshop's 13 actions (heat, shape, quench, temper and the rest) are steps already.

The UI should be built the way the engine is.

### Options weighed (MKC82)

Every option was walked on the same hard task. Klein, at Tingen, brews a Beyonder potion for a client from a bought formula that may be incomplete. He is interrupted halfway, comes back, and then wants to repeat it later.

| Option | Organizing unit | The walk | Verdict |
| --- | --- | --- | --- |
| O1 Today | A form of selects per bench | Pick formula, buy, start, wait, bottle. The steps stay hidden, so he has no way to doubt the formula or find the flaw. The interruption is a job timer. | Fast and cohesive, but not making |
| O2 Round 5 | A bespoke screen per kind | The rite circle shows risk well, but repeating it later means redoing the circle, and nothing he learns here carries to Fang Yuan's fusion screen | Varied but incoherent; complexity trapped in drawings |
| O3 **The method** | A sequence of steps acting on a workpiece; one bench layout for every kind | Below | **Recommended** |
| O4 The workshop line (unusual) | Stations laid out as a line that hands workpieces along, built and automated like a factory | Klein would build a brewing line before he could brew once | Cohesive and deep, but it starts at automation. It returns as a layer on O3 (MKC92). |
| O5 One state map for all (unusual) | Every making is a dot moving through a property space | It fits potions, is forced for forging and Gu, and hides the steps | The map survives as one gauge where a kind has a real property space (MKC79) |

**The O3 walk.**

1. The formula opens as a **method**: an ordered list of steps that came from a seller, marked "bought, unchecked".
2. Guided mode lights the next step.
3. He divines on the method (a test step). One step turns "?" with "the proportions here may be wrong".
4. He edits that step and runs it.
5. The **workpiece**, the brew in progress, shows its gauges throughout: potency, stability, and spirituality spent.
6. He is interrupted at step 4 of 6. On return the timeline shows "step 4, the mixture is settling, 20 min" (`making_procedure` already keeps completed steps).
7. Next delivers to the client.
8. Later, the method is his own, corrected copy. Quick runs it as ×1 or queued.

The same three objects carry Fang Yuan's fusion, Harry's class brew, a Village sword and Zorian's spell.

### The design: three objects, one bench (MKC83)

| Object | What it is | Owner today |
| --- | --- | --- |
| **Workpiece** | The thing in progress: its inputs, its state (gauges) and its history. It becomes the product. | Simulation jobs and participants (`making_procedure`); the item instance for gear (`gear_work`) |
| **Step** | One verb acting on the workpiece: add, heat, shape, stir, wait, carve, bind, feed, hold, cast or test. It has a duration, a station or tool, a timing window if hands-on, and its effect on the gauges. | `dose_process` slots and minutes; `craft_process_thermal`; gear actions |
| **Method** | A saved, ordered list of steps with conditions ("until the colour turns", "if heat drops below working"). It is knowledge: learned, bought, taught, corrected, sold or kept secret. | `making_procedure` rows; `defineCastMaking` fixed batches become read-only methods |

**One bench layout, the same in every world:**

```
┌ Goes in ──────┐┌ The workpiece ─────────────────────┐┌ How sure ─────┐
│ stock, tools, ││ figure (dressed by kind and world) ││ known vs ?    │
│ station, who  ││ gauges: 2–4 real variables         ││ After         │
│ is helping    ││                                    ││ Next          │
└───────────────┘└────────────────────────────────────┘└───────────────┘
┌ Method timeline ──────────────────────────────────────────────────────┐
│ ① add ✓  ② heat ✓  ③ stir ▶ (window)  ④ wait 20m  ⑤ test ?  ⑥ bottle │
│ [Quick ×n] [Guided] [Hands-on] [Edit method]        source: bought  │
└──────────────────────────────────────────────────────────────────────┘
```

What changes per kind is three things, all data:

- the step vocabulary
- the 2-4 gauges
- the figure's dress

What does not change is where anything is. A player who forged a sword can read Fang Yuan's fusion at a glance. This is UR94 (shared grammar, distinct composition) taken to the structure. Round 5's figures survive as the dress of the centre box. Its shared feel (MKC72) applies unchanged.

| Kind | Gauges (from the law) | Step vocabulary |
| --- | --- | --- |
| K1 Forge | heat (the hot window), hardness, toughness (corrected 2026-11-20, MKC106) | heat, shape, quench, temper, finish, refit, hone |
| K2 Mixing | the effect-map position (MKC79), temperature, volume | add, grind, heat, stir, simmer, cool, strain, bottle |
| K3 Characteristic | potency, stability, the maker's spirituality | add the characteristic, add supplements, stir, rest, test by divination |
| K4 Gu fuse | the Gu's will, essence held, integrity of inputs | bind materials, feed essence, hold (hands-on), settle |
| K5 Pattern | room on the carrier, link coherence | choose carrier, carve, link, charge |
| K6 Ritual | the power's attention, the offering's sufficiency | prepare, offer, invoke step, close |
| K8 Invent | open hypotheses, confidence | state, build, trial, observe, write up |
| K9 Spell | cost, stability, reliability | form, effect, augment, test-cast, practise |

### Where the complexity lives now (MKC84)

Round 5 put the complexity into drawings. O3 puts it into rules that every kind shares, so learning one teaches all:

1. **Order matters.** A step's effect depends on the workpiece state when it runs. Quenching before shaping hardens the wrong shape; adding the characteristic before the supplements spikes potency.
2. **Timing windows.** Hands-on steps have a window where control is best: strike while hot, take off the heat at the colour, release the will hold at the peak. Quick and Guided take the method's recorded timing.
3. **Conditions.** A method can say "stir until…", "heat if below…", "stop if stability under…". Writing conditions is the deep layer and the bridge to automation.
4. **Inputs carry traits.** Input quality, lineage and traits pass into the workpiece by the law's rules (traits from materials, in the Atelier pattern). The item sheet shows where each came from (MKC12).
5. **Gaps and substitutions.** A missing slot can be substituted at a known cost (`dose_process` gaps, `ritual_conditions` graded met, substituted, partial or absent).
6. **Environment and station.** Station tier, tool, place law, season, moon, a hidden room, or the clan's eye all modify steps as named, sourced modifiers. LOTM ritual timing and Gu essence fit here, not in special screens.
7. **People.** A helper performs some steps: Neil brews while Klein watches, a class partner takes alternate steps, an apprentice runs the Quick queue. Each person's skill applies to their own steps.
8. **Failure branches.** A failed step does not just end the make. The workpiece branches into a named by-product (FE5) or a damaged state you can rescue with a step.
9. **Scale.** Batch size changes the gauges' rates: a bigger pot heats slower, and ten Gu in a colony feed together.
10. **Methods have a life.** Reliability is learned by repeats; versions keep their history; a bought method may be wrong; taught methods carry their lineage (MKC58); a variant you improve becomes yours.

The layers decide how much of this a player meets:

- **Quick** meets none of it.
- **Guided** shows 1-3.
- **Hands-on** plays 2.
- **Edit method** reaches 3 and 10.

The complexity is all there, but nobody is forced through it (MKC73).

### Transition from today (MKC85)

- The **gear workshop's** selects become steps: its 13 actions are the K1 vocabulary. Its item becomes the workpiece; maker and focus become "who" and step options.
- The **rune bench** keeps its strip as the K5 timeline. Its five parts move into the frame's How sure and After, and Next stays (MKC60).
- The **herbal experiments**, **Potioneering** and the **LOTM formula bench** map their existing stages onto steps.
- **Authored acts** (`defineCastMaking`, the Seer brew, Harry's class) become read-only methods shown on the same timeline: same layout, no editing.
- **Persistence.** `making_procedure` keeps completed steps today. New saved state is limited to the method library per life (a namespaced slice, MKC52) and a workpiece's step pointer where a bench does not yet run on `making_procedure`.

### The thin slice to prove it (MKC86)

**Village forge, one sword, end to end on the new layout.**

1. Choose the iron sword as the workpiece.
2. Run heat, shape, quench, temper as a Guided timeline with heat, hardness and toughness gauges (corrected 2026-11-20: shape runs once and there is no stress variable; see MKC106).
3. Save it as "my sword method".
4. Run it again with Quick ×2 on a second piece.
5. Use the Next row.

**Success:**

- A repeat takes fewer clicks than today's selects.
- The steps read as making.
- The same layout shows the rune bench with no new layout code.

**Revise if:** Quick is slower than the selects for repeat work, or the timeline cannot express the rune strip.

**How to build it.** Per MW9 (2026-11-19), mocks are a real-code `mock/forge-method-<date>` branch rendered from a scenario save, not a standalone page. The gear workshop layout is his pending question (MKC77), so the mock is the proposal for his look.

**Reversing uncertainty:** whether players want to see steps at all for repeat work. The Quick layer is the hedge, and the mock measures it.

### More to consider (ranked)

**ACCOUNT FOR NOW**

- **MKC87 · One step grammar across worlds.** Step verbs and gauges come from each world's law data (MR "world styles are data"). One verb can mean different things by world ("bind" in Gu refinement versus a rune link), and the label shows the world's word.
- **MKC88 · Methods are knowledge, so they follow the knowledge rules.** A bought or taught method carries its source and freshness (UR84). A step's true effect can stay "?" until run (MR1). Sealed truths stay sealed in a method's text.
- **MKC89 · A workpiece is a real thing.** Inputs leave stock when the first step consumes them, and the workpiece is conserved and visible: in the Gu house, on the anvil, in the pot. Cancel follows `making_procedure`'s refundable job rule.
- **MKC90 · Gauges are few and true.** There are two to four per kind, each a law variable (MKC74), each with "?" when unknown. More detail belongs in the item sheet's layers (UR96), not on the bench.
- **MKC91 · The game MCP and agents run methods.** A method is data, so headless agents can run, compare and verify making loops (MKC55). That is also how balance passes can test methods at scale.

**LATER / DELEGATE**

- **MKC92 · Lines (O4 as a layer).** Once a life owns stations and helpers, chained methods (refine → forge → inscribe) run as a line for idle. Station layout, throughput and bottlenecks are the factory pattern on top of methods, not instead of them.
- **MKC93 · Method trade and competition.** Methods sell, leak and get stolen; NPC makers (MKC40) hold their own; a famous method is a world fact. This ties to economy and knowledge checks.
- **MKC94 · Cross-world methods.** A method crosses as knowledge (XWR5). Its steps convert only where the destination's law has the verb, and the bench marks the steps that have no counterpart there. That makes I4's "what carries" visible.
- **MKC95 · A method view outside the bench.** The Making page (MKC37) lists methods as the life's real craft knowledge: what you can make, how reliably, where you learned it.

Round 6 supersedes round 5's "a screen per kind" (MKC71) as the organizing idea. MKC71's figures become the centre box's dress per kind, and MKC72's shared feel stands.

## Round 7, 2026-11-20: five forms, embedded in the scene

Weibao asked whether making can be five different screens embedded in the scene, following the cohesion rules (UR163-UR176). Yes. This keeps round 6's model (workpiece, step, method) and changes two things: how many centre forms there are, and where the bench lives.

### What the cohesion rules ask for (MKC96)

- **UR166, one form per meaning.** One bench form per kind of making, dressed by world. Nine kinds with nine dresses (round 6's table) is too many meanings for one idea; one form for all of them (round 6's frame alone) hides the mechanism (UR93).
- **UR158, one row per thing here.** A station at a place appears once, and its actions live on its row. Today the gear workshop and rune bench are dock panels (`layout_spec.js`, ST2 and ST6), reached from navigation, not from the anvil in the scene.
- **UR41 and UR172.** A place service belongs in its task region; long work replaces the centre on a click and keeps You, Inventory and Reports.
- **UR163 and UR98.** The kit draws rows, verbs, chips and tooltips; distinct forms are L3 compositions on the shared figure layouts.

### The five forms (MKC97)

Each form is the L3 centre of round 6's frame, grouped by what the hands actually do. A world dresses it (DSG12-DSG17).

| Form | Kinds | The figure | Lives at (in the scene) |
| --- | --- | --- | --- |
| F1 Shape | K1 forge, K7 the blank | the workpiece on the anvil or bench: silhouette, heat colour, hardness and toughness | forge, yard, wandmaker's bench |
| F2 Mix | K2 mixing, K3 characteristic | the vessel: what is in it, stage, temperature, the effect map where the law has one (MKC79) | counter, cauldron, the LOTM formula table |
| F3 Pattern and rite | K5 pattern, K6 ritual | a layout on a carrier: rune strip, ward circle, altar placements in order | carving bench, ritual space, a cleared floor |
| F4 Living | K4 Gu refine and keep, familiars | the creature and what holds it: will, hunger, essence held | Gu house, refining vessel, a kennel |
| F5 Design | K8 invent, K9 spell | a trial notebook: hypotheses, trials, what each showed | desk, practice room, a quiet place |

Why rituals sit with patterns: both are placements in an order on a carrier, and UR93's ritual mechanism (ordered steps, placements, offerings, invocation) is a layout, not a mixture. A rite adds one gauge, the power's attention. Revise if LOTM rituals read as mixing in play.

Five is the smallest set where no two kinds in a form disagree about what the hands do. Fewer forces Gu into a vessel or a spell into an anvil.

### Embedded, with three depths (MKC98)

The bench stops being a panel you navigate to. It sits on the station's row in Here, at the depth the task needs (UR42, disclosure by frequency):

| Depth | What shows | Where | Round 6 layer |
| --- | --- | --- | --- |
| Row | one line: "Anvil · iron sword · step 3 of 6 · 12 min" plus [Again ×n] | the station row in Here | Quick |
| Card | the frame folded small: Goes in chips, the form's figure and 2-4 gauges, the current step, How sure and Next | unfolds under that row, one at a time | Guided |
| Centre | the full frame with the method timeline | replaces the centre (UR172), bottom back bar and Esc | Hands-on, Edit method |

Only the station you are using unfolds; every other station stays a row (SUI8's one card at a time, UR145's size-to-content). The card and the centre are the same frame at two sizes, so nothing moves when you expand.

### What embedding changes (MKC99)

- **The workpiece is where it is.** A sword half-forged stays on the anvil when you leave. The under-way list (UIV3) shows it with what travel does to it, and the Village forge row shows it when you return. That is MKC89 made visible, and it is true in-world.
- **Portable making follows you.** F5 and the carving knife side of F3 need no station; they embed at any place that allows quiet work, and otherwise open from the Making page (MKC37). A place can refuse ("Too loud to study here", UR128).
- **Scenes interrupt cleanly.** When a visitor's card opens, the making card folds to its row; the workpiece and step pointer survive through `making_procedure`. Hands-on timing pauses only where the law allows (a quench does not wait).
- **Finding a craft is finding a place.** The gating question (MKC1) gets a natural answer: a craft opens where a station or a teacher is. Navigation still lists found benches for return trips.
- **Benches stop being drawn twice.** The dock panel and a station row for the same bench would break UR158. The dock entry becomes a pointer to the station ("At the Village forge, 2 h away"), not a second bench.

### Cohesion checks for the five (MKC100)

- Each form is one `registerKitFeature` row on the kit page (UR166), with its empty, full, warning and running states (UR176).
- The frame's parts sit in the same positions in all five, and the figure is what differs. Judge F1 beside the rune bench's F3 at 1920×1080 with the real font (UR176).
- One accent per card, and motion for a settled step (UR165, UR91).
- Each card and its controls get element-sheet rows (UR100-UR127).
- `npm run check:flow` passes `oversized`, `twice` and `dupway` on a crowded Village place with three stations.

### More to consider (ranked)

- **MKC101 · Here gets crowded.** A home with a forge, a counter and a Gu house is three rows plus one card. The row form has to stay one line, and a place with many stations groups them under one "Workshop" row that unfolds (UR145).
- **MKC102 · Helpers and lines need a home.** A helper running a method at your forge (MKC84 rule 7) shows on that station's row with their name. A line (MKC92) is a view across several stations, so it lives on the Making page, not in one scene.
- **MKC103 · The Gu house is already a view.** `src/ui/gu_house_view.js` is the first F4 dress. Moving it onto the home's row is a move, not a rebuild; check its save slice is untouched.
- **MKC104 · Authored acts embed too.** Harry's potions class is F2 at the Potions classroom row, read-only method, with the teacher on the row (UR4).
- **MKC105 · Remote work.** A commissioned smith (MKC40) works at their forge, not yours. Their job shows in the under-way list and on their row when you visit, and it does not open a card in your scene.

### Effect on the thin slice (MKC86)

The Village forge mock now renders at the forge's station row in Here: row, then card, then centre, on one sword. Add to its success list: the forge card and the rune card read as the same frame, and Here passes `check:flow` with both stations present.

## Round 7 built: the forge mock, 2026-11-20

Weibao: "build the forge mock". It lives on branch `mock/forge-method-2026-11-20` (worktree `~/code/yarpg-mock-forge`), built on today's HEAD plus the uncommitted Next slice (MKC60). It is a proposal for his look (MW9), not merged.

### What the engine actually is (corrections)

Building it showed that four earlier claims in this board, and in chat, were wrong:

- **No strike ×3.** The forge's steps are `heat`, `shape`, `quench` and `temper` in `src/gear_work.js`. `shape` refuses a second run ("already been shaped"), so MKC86's "strike ×3" cannot happen. The mock's method is four steps.
- **No stress gauge.** The real variables are the hot window (`hotMinutes`, 5 played minutes in the Village, counted from the stage's time), hardness and toughness. MKC83's K1 row and round 7's F1 row said "stress"; the mock shows heat, hardness and toughness.
- **Not `craft_process_thermal`.** The workshop's fuel comes from `heat_grades.quoteHeat`. The thermal module serves batch cooking and brewing.
- **Not `making_procedure`.** A forge step persists in the item's own `gearwork` record (in its inventory key). The mock reads the step pointer from that stage, so it needs no new saved state.

Each step is an instant, quoted commit (`quoteWorkshop`, then `executeWorkshop`). The hot window counts played minutes, so a timing window only bites when time passes between steps.

### What the mock does (MKC106)

- **Row.** The existing Gear workshop row in Here's Things here carries the forge's state line, for example "Village forge · Iron sword, step 3 of 4: Quench, hot 5 min", plus Work it here and, once a method is saved, Again ×2. A new seam in `src/nearby_context_view.js` (`registerStationRow`) lets a station's owner give its row a line and a slot. The station stays one row (UR158).
- **Card.** Work it here unfolds the frame under that row: Goes in (the piece, other carried pieces to swap onto the anvil, Charcoal, Lamp oil, your Forging), the figure (the method as a track, the gauges as bars, on `src/ui/figure.js`), How sure (the engine's own quote or refusal), After, Next, and the Method bar (the next step, Save as a method, Quick, Hands-on marked not built, Full bench).
- **Centre.** Full bench (or the row's Open) shows the same frame, wider, at the top of the gear workshop panel. Every other process (attach, swap, reroll, repair, hides) stays below as today's selects. When the card is unfolded the centre points to it instead, so the bench is drawn once.
- **Method.** "Save these steps as a method" reads the steps from the piece's own work history. Quick ×n runs it on untreated pieces of the same kind: quote, execute, follow the new key, quote again, and stop at the engine's refusal with its reason. STUB DATA: the library lives in page memory. A reload forgets it, and the bench says so.
- **Rune bench (F3).** The rune strip draws on the same frame (`runeWorkFrame`): the strip is the track and Room is a bar. The parts sit in the same order with no new layout code, apart from an optional Clashes part. Its carve buttons stay its own.

Code: `src/forge_method.js` (model), `src/forge_station.js` (row, card, centre), `renderWorkFrame` in `src/ui/bench_form.js`, `registerStationRow` in `src/nearby_context_view.js`, plus small edits in `gear_workshop_domain.js` (clock, hot window, stock; wiring), `gear_workshop_panel.js` (frame slot), `rune_bench_form.js` and `pledges_ui.js`. `main.js` is untouched.

### Evidence (MKC107)

Same fixture (`frontier-hunt-ready`, Village, Wend the old craftsman here), same DEV SEEDED stock (three Iron swords, 12 Charcoal, 4 Lamp oil, 6 Rough wood log), 1920×1080 headless on a fresh origin.

| Measure | Today (clean HEAD) | Mock |
| --- | --- | --- |
| Clicks to heat-treat 3 swords | 31 (11, then 10 each) | 7 (unfold, 4 steps, save, Again ×2) |
| Result | 3 tempered | 3 tempered |
| Save and reload after Shape | n/a | the row and card resume at "Quench" |
| Reload after Quick ×2 | n/a | 3 tempered swords persist; the stub method is gone |
| Bench drawn twice | n/a | one forge frame on the page with the centre open |
| Page errors | none | none |

The mock run counted 8 clicks because it unfolded again after the reload. Checks: 48 focused tests and `npm run test:changed` (4,815) pass, along with `check:arch` (no `main.js` growth) and `check:player-text`. `npm run check:flow` reports 0 findings on both the mock and clean HEAD, with the same 2 baseline strays. The walk shows the row at rest but does not unfold the card.

### One workpiece, step by step (Codex follow-up, MKC113)

Codex's shared UI review ([activity review](gm/dispatch/play-surface-2026-11-14/ACTIVITY_UI_REVIEW_2026-11-20.md) F4) asked for one real workpiece showing the selected input, cost, changed property and finished result. All four come from the engine's own quote. `spend` gives the cost, and `receive[0]` is the piece as it will be, so the preview is the commit (UIV4). The script is `forge-mock-onepiece.cjs`: one Iron sword, 4 Charcoal and 1 Lamp oil (DEV SEEDED), run through the card.

| Step | Selected input | Cost | Changed property |
| --- | --- | --- | --- |
| Heat | Charcoal ("Heat uses 1") | 1 Charcoal | stage cold → heated |
| Shape | none | nothing but the work | toughness stays ×1: at Forging 0 the gain is 0.005 (now said in words) |
| Quench | Lamp oil ("Quench uses 1") | 1 Lamp oil | hardness ×1 → ×1.15, toughness ×1 → ×0.81 |
| Temper | Charcoal | 1 Charcoal | hardness ×1.15 → ×1.05, toughness ×0.81 → ×1.11 |
| Finished | | | "Finished: Iron sword · tempered · hardness ×1.05 · toughness ×1.11", and "Heat-treated edge ×1.01" is what it gives now. Next offers Wear it, Carve a rune tablet and Sell it. |

The saved item reads tempered, hardness 1.05 and toughness 1.105, which matches the card, and the page showed no errors.

**Not covered:** a component swap. The review's own example is "compare the same workpiece before and after changing a component". Swap still lives in the selects below the frame. It needs a picker of compatible parts and the same before-to-after rows, and its quote already carries the result key.

### What the forge and the RI combat example can share (MKC114)

The combat owner is Play surface UI cohesion, which has Fang Yuan against the lightning-wolf pack. Codex's split is that the encounter belongs to combat, the station belongs to the forge, and the two share selection, focus preview, cost, commit, outcome and return. Building the forge confirms that split, with these specifics:

**Genuinely shared** (one form, both activities):
- **The cost row, read from the quote before commit.** It shows "1 Lamp oil" at the forge and the quoted essence for Moonglow beside the reserve in the fight. Both come from the owner's quote, and both recheck on commit (UIV4, SUI6).
- **Before-to-after property rows.** Hardness ×1 → ×1.15 at the forge; the reserve 44 → 24 in the fight. Same row: label, before, arrow, after, with a plain-words line when the change rounds to nothing.
- **The refusal beside the control.** The engine's own reason sits on the disabled step ("Select carried Lamp oil…" or "not enough essence"). The forge shows this; combat needs it for the last affordable blade (UR128).
- **The outcome receipt and Next.** The finished piece with what it gives now, then where it can go. For the fight: the settled exchange, then what the player can still do. The Next part (`making_next.js`) fits both.
- **The row line plus unfold slot (`registerStationRow`).** Only if combat wants a Here row for an encounter. UR167 keeps the fight in YAIR's Opponent box, so this probably stays a station-only seam.

**Forge only:**
- the workpiece track, with its steps, current step and cooled-back-to-Heat rule
- the gauges: hot window, hardness and toughness
- other pieces to swap onto the anvil
- save as a method, and Quick ×n
- the Room bar (on the rune bench)

**Combat only:** pack pressure, the immediate threat, beats and openings, the fight clock and auto-fight tracks. A fight's history is Reports, not a method.

**A shared frame edit needs the other owner first.** The shared frame lives in `renderWorkFrame` (`src/ui/bench_form.js`) and `registerStationRow` (`src/nearby_context_view.js`), both on the mock branch only. Play surface UI cohesion answered on 2026-11-20. Its fight mock (`mock/fight-form-2026-11-19`) draws in the native Opponent box with the fight card docked under the board. It needs neither the work frame nor the row-plus-slot, and it owns neither file. It may later reuse **How sure** and **After** for a move's odds and outcome preview, so those two parts stay generic and carry no forge words. The forge's specifics live in its row data (`forgeChange`, `forgeCost`), not in the part names. The row line, unfold slot, step track, Quick ×n, gauges and hot window stay with the forge. The two branches share no files apart from separate appended lines in `styles/manifest.txt`, which this mock does not touch.

### Methods already have an owner (MKC115)

`src/craft_working.js` already defines a working as "a saved sequence of verbs and material roles". It has steps, a law version and reusable parts, and the Hogwarts glass repair saves one. That is round 6's method object, live in the book-world crafts. So the mock's stub library is the wrong seam. A real build gives the forge a `craft_working` law (its ops are heat, shape, quench and temper) and saves methods there, instead of the new slice MKC52 proposed. Check that the gear workshop's item-key persistence and the working's lots and stations fit before building.

### Against MKC86's success list

- **Fewer clicks for repeat work:** met. Repeating takes 1 click against 10 per sword.
- **The steps read as making:** for Weibao's eye. The captures are under `docs/representations/evidence/making/forge-mock-*`.
- **The rune bench fits the same layout with no new layout code:** met, apart from the optional Clashes part.

### What the mock shows is still wrong (ranked)

- **MKC108 · The figure is small in the centre's middle column.** The track and bars shrink to fit a third of a 600 px panel. A real build gives the figure the wider column or a taller drawing, judged at 21 px (UR176).
- **MKC109 · Row verbs wrap.** The Things-here row puts Open, then Work it here, on separate lines. Open and Full bench mean the same thing, so the real build keeps one.
- **MKC110 · Quick runs instantly.** Steps are instant commits, so Quick ×2 finishes two swords in one click with no time passing. A real Quick should cost the played minutes the work takes (a queued job), or the forge outpaces every timed craft. That is a law change, not a UI change.
- **MKC111 · The hot window does not bite.** With instant steps and no time between them, the metal stays hot through all four. Hands-on timing (MKC70) needs steps that take time first.
- **MKC116 · The card's gauge bars draw as text at Here's width.** The figure keeps the words but loses the bars in the narrow column; the centre draws them.
- **MKC112 · Not built:** the method library save slice (MKC52), Edit method, hands-on timing, element-sheet rows (UR100-UR127), a kit page row for the frame (UR166), F2, F4 and F5.

## Build first (ranked, revised for round 2)

1. **MKC33 and MKC5 · The spine and its Next row on the shared bench.** Every world's existing bench moves onto it, so each world gets a loop from what is live. That covers the gear workshop, rune bench, experiments, Potioneering, the LOTM bench and the Gu cards. The Village part is built: rune bench and gear workshop (MKC60).
2. **MKC19 · Made consumables in fights.** One action type reads a dose for K2 and K3, a charge for K5 and an activation for K4.
3. **MKC17, MKC13 and MKC40 · Orders from the world's own buyers.** One order record serves the villager, the Nighthawk colleague, the clan market and a Phandalin townsman.
4. **MKC34 · The kinds as law modules.** Start with the four kinds that have live content: K1, K2, K3 and K5. K4 follows with the Gu refine bench and the Gu house (MKC28, MKC42), K8 with Mol (MKC23), and K9 with spell practice in Skills (MKC48).
5. **MKC37 · The Making page per life.** It is the one new screen, and it lists every world's crafts the same way.

Done check for the round: in the Village, Tingen, Hogwarts and the Gu life, one made thing goes from the bench to a use and to a buyer. Each step is reachable from the bench's Next row, with rebuilt browser proof on a fresh origin and save, reload, export and import.

## Questions

- Q1. Do gates open on mechanism (MKC1 and MKC4, with Mechanism as the default), or do you want some crafts bought outright as a shop unlock?
- Q2. Do Hogwarts and Tingen let you make crafts their protagonists do not practise in canon (Harry forging, Klein brewing before his pathway allows it), or stay inside canon?
- Q3. Should making for others (orders and commissions) be a main income route, or a side one?
- Q4. Answered 2026-11-19: all worlds, typed by capability (round 2).
- Q5. Should kinds K6 (borrowed power) and K7 (bond) be makeable by the player in round 2, or stay as NPC crafts until a life needs them?
- Q6. Is cross-world ingredient mixing (MKC39) wanted early as a reason to travel, or held until crossing has weight (I4)?
- Q7. Is spellcraft (K9) in scope for round 2, starting with Hogwarts charm variation and Gu killer-move composition, or after the other kinds?
- Q8. For raised Gu, should starvation be real where canon records it (the default), or softened to a pause?
- Q9. Is the method (workpiece, steps, method; one bench layout, MKC83) the organizing idea, proved by the Village forge mock branch (MKC86)? This replaces round 5's three-way forge prototype (MKC78).
- Q10. Are the five forms (MKC97) the right grouping, with rituals beside patterns, and should the dock bench panels become pointers to their station rows (MKC99)?
