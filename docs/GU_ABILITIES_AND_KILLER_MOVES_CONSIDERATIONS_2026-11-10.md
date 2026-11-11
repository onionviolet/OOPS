# Gu abilities and killer moves: considerations (2026-11-10)

Palette, not spec. Working defaults under AD56, adjustable. Requested by Weibao: "also consider abilities tied to gu, gu killer moves, which is moves made by using a combinatiobn of gus, other stuff and more?" ([log](gm/USER_VISION_LOG_2026-11.md#gu-abilities-and-killer-moves-2026-11-10)).

What exists: the [world card](WORLD_CARDS.md) says Gu are living power you keep and feed, and that killer moves come from recipes combining several Gu ("recipes, not grinding"; "no skill grows from use alone"). In code, each lead-life Gu is an actor fact (`actor.<vital>.moonlight_form`) read by story beats in `src/world_packs/book_gu_lead_*.js`; feeding runs through the keeper (`book_world_gu_keeper_domain.js`) and the needs seam; the pet being record (CPR10) now holds a kept Gu. No ability model or killer move exists in code. The [area guide](AREA_GUIDE.md) records two live routes into one structured ability descriptor (power grammar to spell seam to ability records, and the HP/LOTM spell route), so a Gu ability lands on that descriptor, not a third route.

Canon facts below are stated from the community wiki digest and the read books; each needs a text locator when a slice uses it (SKR1, SKR21).

## Gu abilities

| Code | Default | Dial and reason | Builds on |
| --- | --- | --- | --- |
| GKM1 | **A Gu's ability is its function, read from the being.** Each Gu kind has one function (a blade of moonlight, a jade skin), a path, a rank and a use cost in essence of that rank. Using it is a command that quotes cost and readiness, then revalidates (AR7). | Dial: a world sets how many functions a kind has. Reason: canon Gu are specialised living tools. | CPR10 being record, ability records |
| GKM2 | **Readiness is the Gu's real state.** A hungry, injured, rebellious or absent Gu cannot act or acts weakly; driving a Gu above your rank is possible at a cost (round 2, GKM13). | Dial: rebellion odds per world. Reason: "your strength is your stable" (world card); the wiki digest says a stronger Gu can exceed the bearer's means and become dangerous, not that it is impossible (DR1). | Needs seam, being record |
| GKM3 | **Some Gu are spent by use.** Single-use and consumable Gu leave the being record when used; refinement consumes inputs. | Reason: canon single-use Gu and refinement; conserved custody (SR, ITM). | Spoilage-style instance ids |
| GKM4 | **Immortal Gu are one of a kind.** A kind marked unique has one instance in the world; owning it is a fact others can hunt. | Dial: uniqueness per kind. Reason: canon; gives theft and fate pressure. | Acting powers, news travels |

## Killer moves

| Code | Default | Dial and reason | Builds on |
| --- | --- | --- | --- |
| GKM5 | **A killer move is a recipe over Gu roles.** One core Gu plus supporting Gu in named roles; the recipe names roles, not specific instances, so any owned Gu that fills a role can serve. | Reason: canon moves pivot on a core Gu; roles let the lead improvise substitutes. | MR making rules (recipes as data) |
| GKM6 | **The move's effect follows from its parts.** Effect is composed from the core function plus what each supporting role adds (reach, force, duration, concealment), the way Ars Nouveau composes form, effect and augments and Noita stacks modifiers; a canon move is a fitted recipe calibrated first (SKR21), not a lookup row. | Reason: AD38, things work by how they work; it also lets invented moves exist. | `docs/research/ars-nouveau`, `docs/research/noita` |
| GKM7 | **Knowing a recipe is knowledge.** Recipes are learned, bought, stolen, deduced or inherited, and sit on the KNW ladder (known, guessed, open) per character, as items now do (ITM23). | Reason: canon inheritances and recipe trade. | Item knowledge, KNW3 |
| GKM8 | **Casting costs the sum and risks backlash.** Essence for every Gu used, at their ranks; a failed role (missing, hungry, wrong rank) fails the move with a backlash scaled by how far it fell short. | Dial: backlash severity per world. Reason: canon risk of untested moves; no forced weakness beyond the mechanism (AD55). | Harm carrier (RCL5) |
| GKM9 | **Practice makes a move reliable, Gu do not level from use.** A move's reliability rises with practice of that recipe; the Gu themselves grow only by feeding and refining. | Dial: this is where the mastery lane's per-action mastery fits the Gu world, scoped to moves. Reason: world card absence ("no skill grows from use alone") applies to Gu, while canon cultivators still drill moves. | Mastery lane |
| GKM10 | **One Gu, one move at a time.** A Gu busy in a running move cannot serve another; sustained moves hold their Gu until released. | Reason: conserved custody. | AR3 one authority |
| GKM11 | **Dao marks bend moves.** Marks of a path on the body strengthen moves of that path and interfere with others. | Dial: interference strength. Reason: canon dao marks; makes path choice matter. | Later slice |
| GKM12 | **Invention is a route.** A lead can deduce a new recipe from Gu they own and moves they know (wisdom path, trial); invented recipes are `original` rows with a reason (SKR17). | Reason: Fang Yuan improvises; route variety (STY33). Achievements' "Another way" can read it. | Achievements lane |

## Other Gu stuff

- **Refinement combines Gu into a higher rank** (exists as a story beat; a recipe seam would share GKM5's shape).
- **Gu houses and formations**: many Gu acting as a fixed structure, the killer move shape applied to a place (SR sites).
- **Taking another's Gu**: theft, killing a master to free a Gu, Gu loyalty; reads custody and news.
- **Cross-world (AR11)**: the seam is "a composed ability from owned living or crafted parts". Second cases: Ars Nouveau glyph spells, LOTM rituals combining ingredients, D&D metamagic.

## First slice (proposal)

One canon mortal killer move Fang Yuan uses early, built from Gu he holds at that point, calibrated to the text, plus one substitute that works by mechanism. Shown in a move panel listing roles, which owned Gu fill them and their readiness. Save, reload and import keep known recipes and practice.

## Round 2, 2026-11-10: above your rank, procedural moves, and worlds with the same shape

Weibao asked: "Using gu above rank is possible? consider techniques of condensing higher rank essense and mroe? or other people giving you some? We should consider all possibilities, Other stuff to consider? procedural system for in world systems like gu killer moves? More to consider? We can build the rules around the worlds too, consider other worlds with similar considerations we would need to consider." Round 1's GKM2 line said a Gu above your rank "cannot be driven"; that was a limiting line written without his answer (AD56) and is now revised to GKM13.

### ACT NOW (done in this round)

| Code | Default | Dial and reason |
| --- | --- | --- |
| GKM13 | **Driving a Gu above your rank works by how essence works.** A Gu needs essence of its own grade; any route that supplies that grade drives it. The cost grows with the gap (more essence per use, strain on the aperture, a chance the Gu resists or backlashes) and is shown before use (AR7 quote). | Dial: cost curve and backlash per world. Reason: wiki digest DR1 ("a stronger tool can exceed the bearer's means and become dangerous"); AD38. |
| GKM14 | **Routes to higher-grade essence, each a real mechanism with its own cost:** (a) **stored**: essence held in a vessel or stone of that grade, bought, found or inherited, spent once; (b) **condensed**: a technique or Gu that refines your essence upward, slow and lossy, with aperture strain; (c) **given**: another person pours their essence in, through contact, a shared Gu or a pact, so the giver's trust, presence and price matter (ties, opinion); (d) **lent core**: a higher-rank ally drives the core Gu of a killer move while you fill support roles; (e) **burned**: spending something you cannot easily regain (lifespan, aperture damage, a Gu sacrificed) for one surge. | Dial: which routes a world has and their rates. Reason: each route is a lever other systems already model (custody, ties, harm, sacrifice). Canon locators owed per route before a slice uses it (SKR1). |
| GKM15 | **Above-rank use is legible.** The quote names the route, the gap, the essence cost, the strain and the backlash odds; the panel shows which roles in a move are above rank. | Reason: trust (PX), cheap mistakes. |

### ACCOUNT FOR NOW (constraints on the current killer-move lane)

| Code | Constraint |
| --- | --- |
| GKM16 | Rank is an input to cost and risk, never a hard gate in code; a gate needs Weibao's answer as a limiting line. |
| GKM17 | Essence is a typed amount (grade, owner, source), so given and stored essence keep their provenance and a giver's essence can carry their path or intent where canon says it does. |
| GKM18 | The recipe, the role fill and the cost read are separate pure functions, so a generator (GKM19) and NPCs can call the same code the player uses. |

### Procedural killer moves

| Code | Default | Dial and reason |
| --- | --- | --- |
| GKM19 | **A killer move generator over the same grammar.** Candidate moves come from the Gu kinds a holder owns: pick a core by path, add supporting roles whose functions compose (GKM6), score by synergy, cost and dao-mark fit. Generated moves are `original` rows with generator `id@rev` and seed (SKR17, GR3, GR10). | Reason: NPC Gu masters get real moves from their real Gu; invention (GKM12) becomes the player using the same generator through study. |
| GKM20 | **NPCs fight with what they hold.** An NPC's moves are generated from their Gu, so taking or killing their Gu changes what they can do. | Reason: AD38; makes theft and Gu loss matter. |
| GKM21 | **Gu kinds can be generated too, inside a path's grammar.** A path names function families; a generated kind is a function, rank, food and cost from those families, labelled generated. | Dial: off for canon-only seats. Reason: canon has thousands of kinds; the text names few. |
| GKM22 | **Generators are calibrated against canon first.** A generator's output for a canon holder (Fang Yuan's early Gu) must reproduce or sit near canon's moves before it fills unknown holders. | Reason: SKR21, WKR21. |

### Worlds with the same shape (cross-world rules)

The shared shape: **abilities composed from parts you hold, fuelled by a graded resource, with knowledge of the recipe, practice for reliability, a cost and risk for going beyond your level, and invention as a route.** Proposed as one cross-world rulebook (working name: composed abilities, codes CAB) built from these worlds rather than from Gu alone (WKR21: presets come from canon worlds built first).

| World | Parts | Graded fuel | Above your level | Composition and invention |
| --- | --- | --- | --- | --- |
| Reverend Insanity | Gu | Essence by grade | GKM13–GKM14 | Killer moves, deduction |
| Mother of Learning | Spell formulas, shaping skills | Mana reserves | Overchannelling, borrowed mana via items | Zorian edits and builds formulas; formula cubes as stored spells |
| Lord of the Mysteries | Potion ingredients, ritual parts, Beyonder characteristics | Sequence and spirituality | Rituals that borrow a higher being's power, at the price of attention (acting powers) | Rituals composed from symbols, names and offerings |
| Harry Potter | Wand, incantation, intent | Skill and wand fit | Magic beyond training goes wild; wand allegiance changes power | Spell invention (canon examples exist) |
| D&D (SRD) | Spell components, metamagic | Spell slots by level | Scrolls above level with a check | Metamagic composes onto spells; homebrew as generated rows |
| Jujutsu Kaisen | Cursed technique, binding vows | Cursed energy | Vows trade a restriction for power | Technique extensions, domain expansion |
| Naruto, Hunter x Hunter, Fullmetal Alchemist (later, acquisition first) | Hand seals and natures; Nen categories; transmutation circles | Chakra; aura; equivalent exchange | Borrowed chakra; vows; a toll for the gate | Combining natures; Nen vows; circle design |
| Ars Nouveau, Noita (games, bank) | Glyphs; wand modifiers | Mana | None by default | Form, effect, augment; modifier stacking (the composition model GKM6 uses) |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| GKM23 | Build the GKM19 generator on the killer-move lane's pure functions, calibrated per GKM22 | Sonnet, medium | Fang Yuan's early holdings generate his canon early move among the top candidates |
| GKM24 | Second world for the composed-ability seam (AR11): Zorian's spell formulas | Sonnet, medium | One MOL spell built from formula parts through the same role and cost reader |
| GKM25 | Draft the composed abilities rulebook (CAB) from GKM1–GKM22 and the table above, register its prefix in RULES_INDEX | Sonnet, small | `check:rules` passes with the new register row |
| GKM26 | Canon locators for each GKM14 route in Reverend Insanity | Haiku reader, small, from the held text | Each route row carries a chapter locator or is marked original |
## First slice built (2026-11-10, proposal under AD56, agent-verified, not human-reviewed)

What runs, in the keeper life (`book.ri.keeper`), the Gu life that has the needs seam and the being record wired:

- **GKM1.** Each keeper Gu row carries a `use` (function, path, rank, essence, base or augment), read through its being record (`being_gu.js` passes it, `being_record.js` keeps it). A lone Gu's ability is a one-role recipe, so "Moonblade" and the killer moves are one code path.
- **GKM2.** `gu_keeper_move_view.js` reads each Gu's claim, life, place, the being record's care reading (sound, at risk, starved out) and rank against the aperture's rank (dial `apertureRank: 1`). Not yours, dead or elsewhere blocks the command; hungry or starved out lets it start and backfire; rank never blocks (GKM16).
- **GKM5-GKM6.** `composed_moves.js` fills roles with any owned Gu that fits (one Gu, one role) and composes the parts: scales, then adds; a second augment of the same kind is paid for and bends nothing. Each assignment lowers through power_grammar, spell_seam, ability_records and spell_cast_lowering (the existing route; no third route). Magnitude is boars felled (clan bounty stones); reach shortens the hunt.
- **GKM7.** Recipes are knowledge entries: the steward tells you the pairing (known); you work out the jade-guarded variant yourself (worked out, untried), and its first clean cast settles it as known (KNW3, `certaintyOf`).
- **GKM8.** Cost is the cost read's typed lines, one per Gu used (below). A role that falls short fails the move; recoil hits the core Gu's condition by the number of short roles, never below 1, and the essence is spent.
- **GKM10.** A move's Gu are participants of its job, so the engine refuses any other command that needs them while it runs; the panel shows "busy".

- **GKM13-GKM18 (round 2).** `composed_moves.js` keeps three separate pure reads: the recipe (`defineRecipe`), the role fill (`assignments`, `composeMove`) and the cost (`moveCost`), so a generator or an NPC can call the same code (GKM18). Essence is a typed line `{part, grade, owner, source, amount, gap}` (GKM17). A Gu above your grade still runs: on your own essence it costs 2^gap times its essence and adds 25% backlash per rank of gap (dials `KM_GAP_CURVE`); on stored essence of its grade (a sealed vial of red steel essence the steward sells, 3 stones, the one GKM14 route here) it pays the plain cost with no risk. Each fuel plan is its own command, so the label and panel name route, gap, cost and odds before use (GKM15). A rank-two Moonglow Gu (12 stones; ch106 three times a Moonlight blade) is the first above-rank Gu in the keeper house and fills the same blade role.

Calibration (SKR21, SKR1, SKR3): Reverend Insanity, Calibre 15 English EPUB. Ch62: the clan store keeps Little Light Gu as the common assistant to a Moonlight Gu. Ch70: essence driven into both, the glow fuses into the moonlight, the moonblade doubles in size and reach. Ch106: two Little Light Gu still add 100%, not 200%. The text calls this a pairing, not a killer move; the first move it names a killer move for Fang Yuan is the eight beast phantoms at rank three (ch319-321), which a first-rank life cannot reach. Model-read layer only; the wiki digest was not consulted for these numbers. Substitute (SKR17, `original`): the jade-guarded moonblade, White Jade Gu in a guard role that adds a kill by letting you close in; with a Little Light it also gains reach. Assumed dials: one stone per boar, an hour's hunt at reach 1, one essence per rank-one Gu, the Little Light Gu's food (lamp moss) and price (2 stones).

Findings:

- **Harm route gap.** The keeper world has no `HARM_WORLDS` row and structured-local commits (`commandStructuredCampaign`) never drain into the `harm` slice, so recoil lands on the core Gu's body, not the shared harm carrier. Closing it needs a keeper harm row and one host drain line after a structured-local commit (an AR1-paid `main.js` line), copying the LOTM inbox (`book_world_lotm_harm.js`).
- **Lead life not wired.** Fang Yuan's lead Gu are actor facts fed by scripted dorm acts, not the needs seam, so the move set does not reach the lead life yet; the composer is world-neutral and can take its Gu once they are upkeep rows.

Not done: GKM3 (spent Gu), GKM4, GKM9 (move practice), GKM11, GKM12, GKM14 routes other than stored (condensed, given, lent core, burned), GKM19-GKM22 (generator), aperture strain from above-rank use (no keeper harm row, see above), sustained moves that hold a Gu while you do something else. Dials not canon: the gap curve, the vial price and grade, the Moonglow Gu's meal and price.
