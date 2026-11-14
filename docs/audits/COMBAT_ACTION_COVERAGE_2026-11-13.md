# Combat action coverage count · 2026-11-13

A held-out count for [CBD102](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#round-19-covering-what-nobody-listed-2026-11-13): fight actions from scenes in the three leads' books that no move row encodes, each written as verb, subject, means and manner (CBD94, CBD96) over the [effect grammar](../PROCEDURAL_FOUNDATION_PLAN.md#one-effect-grammar-for-every-world) verbs. Findings and proposals, not accepted decisions. It feeds CBD92 and the [world sizing audit](COMBAT_WORLD_SIZING_2026-11-13.md).

## How it was done, and how far to trust it

- **Sources.** The repo's own reading notes, all read-only: the per-scene source notes under `docs/research/novels/<book>/private/` (gitignored, so the locators below point at files that exist on this machine and in no other clone), the [Hogwarts spellbook](../research/HOGWARTS_SPELLBOOK_2026-11-11.md) and the lead-life world packs. No book was opened and nothing was downloaded; no book prose is quoted, each action is paraphrased.
- **What counts as "no move row".** None of the three contest or tempo tables names it: [gu_world.js](../../src/contest_packs/gu_world.js) (twelve rows), [hogwarts.js](../../src/contest_packs/hogwarts.js) (four rows) and `TEMPO_MOVES` in [tempo_fight.js](../../src/tempo_fight.js) (jab, swing, guard, tend, withdraw, yield, order, shoot, reload). Spells that live in `spell_pack_hogwarts.js` or a craft row still count as "no move row" here.
- **Not blind.** Three haiku readers proposed candidates (one per world) and the citations were spot-checked against the notes; the classification is the author's reading. The sample is whatever the notes cover, which leans to the early arcs and to scenes already pulled into the lead-life packs, so it understates later and larger fights. Treat the share as a rough figure, not a measurement.
- **The three marks.**
  - **Composes today:** the verb, subject and means already exist as rows or properties, so the action is a data row or a combination.
  - **New property row:** the grammar and the engine already carry the verb; one named property or thing row is missing (data, no engine code).
  - **New effect:** the engine cannot yet do the thing. I count here a move that cannot address a thing, place or third party (G1, G2 and G7 in the sizing audit), since the fix is code, not data.

## The table

Grammar verbs: move, add, remove, transform, bind, release, sense, conceal, copy, block, end, alter. Locators are note files under `docs/research/novels/` unless a doc is named.

### Gu (Reverend Insanity)

| # | Action (paraphrased) | Verb · subject · means · manner | Mark | Locator |
| --- | --- | --- | --- | --- |
| A1 | Drop the guard on purpose so the foe commits a blow, then answer it | release (own block) · the foe's next strike · own stance · as bait; the answer is triggered | **New property row**: an "open" stance the foe's chooser can read, with a triggered counter on the sheet (the engine has `headOpening` but no bait) | reverend-insanity/private/fang-yuan-stone-forest-evidence/SOURCE.md, ch116 P001–P074 |
| A2 | A jade Gu takes incoming blows at a few parts of essence each | block · incoming vitality harm · White Jade Gu · paid per blow | **Composes today**: the same shape as the existing Jade Skin guard working (`raiseJadeSkin`, ch83–85); the Gu has a catalogue row (`white-jade`) | same file, ch114 P001–P094, ch115 P001–P092 |
| A3 | A moving garment steers the aim of the return blow | move · the direction of own blow (force) · a garment Gu · timed to the catch | **New property row**: a Gu row for the means; `move` already accepts force | same file, ch116 P001–P074 |
| A4 | Read the wrist, get inside the rush, circle the return shot, pin, then cut at the lit palm | sense (the wrist) then move (inside) then bind (foe's motion) then remove (vitality at a part) · foe and one hand · Moonblade and body · in that order | **New property row**: a "pinned" state (bound motion) on a body that unlocks the hand-aimed cut; sense, move and the cut exist (`close_in`, `slip_past`, `partRequired`) | same pack, fang-yuan-year-end-evidence/SOURCE.md, ch84 P005–P089 |
| A5 | Set two beast groups against each other until a set number of parts remain | bind (their relation) · two cohorts · provoked beast groups · until a count remains | **New effect**: a move that sets a third party's aim (sizing G1, G2) | fang-yuan-stone-forest-evidence/SOURCE.md, ch115 P001–P092 |
| A6 | Land one blow at a single part, withdraw, pay stones to refill, return | remove (vitality), move (away), add (essence), move (back) · foe, self · Moonblade, then stones · as a retreat and return | **New property row**: a carried stone as a thing that holds essence, spendable mid-fight; withdrawal exists in the exit rules | same file, ch116 P001–P074 |
| A7 | A shadow link lets a blow on one fighter land on another at close range | bind (a relation between two bodies), then remove vitality through it · the linked pair · Shadow Bond · at close range | **New effect**: harm carried along a bind (a relay), sizing G1 | fang-yuan-ice-crystal-evidence/SOURCE.md, ch137 P001–P092; fang-yuan-alliance-slope-evidence/SOURCE.md, ch125 P001–P103 |
| A8 | Keep a hidden threat alive so the foe watches two sides, wait for his retreat, then close in | conceal (the threat's place) then bind (the foe's attention, a facet of mind) · one foe · allies and an unseen threat · wait for the trigger | **New property row**: attention as a quantity on a fighter (CBD176); conceal and triggered time exist | fang-yuan-ice-crystal-evidence/SOURCE.md, ch136 P001–P096 |
| A9 | Throw the blade from the sun's glare so the throw is not seen | conceal (the moment of the throw) · the target's sight · Moonblade and glare · from a glare position | **New property row**: a flag on a projectile move that glare hides it; `slip_past` already seeks glare and the scene carries `light:sun` | fang-yuan-early-duel-evidence/SOURCE.md, ch65 P064–P081, ch66 P001–P090; src/world_packs/book_gu_lead_early_duel.js (the act text) |

### Hogwarts (Harry Potter)

| # | Action (paraphrased) | Verb · subject · means · manner | Mark | Locator |
| --- | --- | --- | --- | --- |
| H1 | A levitation makes a troll drop its club | move (custody of a held thing) · the club · wand and a charm · while the troll swings | **New property row**: a held weapon as a quantity like `focus`, for non-wand implements | harry-potter/private/hp-w7-halloween-2026-11-09/scene-qualification.md, P116–P147 (book 1, ch10) |
| H2 | Harden a tapestry so pursuers run into stone | transform (material) · a surface on the route · wand · during a chase | **New effect**: a move that addresses a thing or a place (G1) | docs/research/HOGWARTS_SPELLBOOK_2026-11-11.md, `duro` (B7 p4258) |
| H3 | Turn a staircase into a slide for the chase | transform (form) · a route · wand · during a chase | **New effect**: the same G1 move, plus a link that changes kind | same doc, `glisseo` (B7 p4258) |
| H4 | Animate suits of armour as defenders that then take orders | add (an agent from a thing) · statues and armour · wand · a school defence, orders after | **New effect**: animate a thing as an ally with its own chooser (G7, G1) | same doc, `animate` (B7 pp4220–4221) |
| H5 | Knock armour down behind you to slow pursuit | move (position of a thing) · armour in a passage · bodies · while fleeing | **New property row**: an "obstructs" property so a placed thing slows or closes a path link; `drop` already records a thing's position | hp-w7-duel-2026-11-09/scene-qualification.md, p140–p153 (book 1, ch9) |
| H6 | Hang a person upside down by one ankle | move (position, raise) · a body · wand and a spoken or silent charm · held while sustained | **Composes today**: a `moveFromSentence` row over `footing` with sustained time; the ending rule `footing: yielded` already reads it | HOGWARTS_SPELLBOOK_2026-11-11.md, `dangling` (B6 p3132, B7 p4163) |

### Lord of the Mysteries

| # | Action (paraphrased) | Verb · subject · means · manner | Mark | Locator |
| --- | --- | --- | --- | --- |
| L1 | Say the taught phrase, feed spirituality to a borrowed sleep charm and throw it as the creature leaps | transform (mind: half asleep) · a leaping monster · a prepared charm, spent · timed to the leap | **New property row**: a throwable prepared charm with a mind effect, on whichever engine runs the fight (the charm exists as a craft row, `lotm.craft.slumber-charm`; tempo has no throw) | lord-of-mysteries/private/kj3az-followthrough-2026-11-09/SWAIN_EMERGENCY_HANDOFF.md, ch129 P058–P070 |
| L2 | Ready a shot but hold it so an ally can land the finishing blow | release (own action) · the ally's action · an order · hold | **New property row**: a "hold and let them finish" order row for the ally chooser; tempo has `order` | same file, ch129 P058–P070 |
| L3 | Check a gate with a pendulum, open Spirit Vision, then push the gate with a cane | sense (information) then move (force on a gate) · a signal and a gate · pendulum, Seer reserve, cane · stepwise on approach | **New property row**: a pendulum divination row on the Seer power grammar and a place state for the signal; Spirit Vision is already a cast (`lotm_be_spells.js`) | kj3ay-signal-and-altar-2026-11-09/SOURCE_HANDOFF.md, ch124 P009–P024 |
| L4 | Divine a person's whereabouts by a written-source divination and get a partial answer through interference | sense (a person's position) · a person · divination from the Seer reserve · partial result | **New effect**: a look action that fills a fight-readable knowledge field with a confidence (G3) | lord-of-mysteries/private/kj3az-followthrough-2026-11-09/SOURCE_HANDOFF.md, ch125 P001–P052 |
| L5 | Draw the revolver to frame a demand, then put it away and leave with an agreement | alter (the other person's choice) · a person's will · revolver and credentials · shown, not fired | **New effect**: a threat by display that moves a foe's choice without damage (contests that are not fights, round 21) | kj3av-daxter-2026-11-09/source-locators.md, line 15 (the Greenhill scene, inside ch111–ch118 P020; exact paragraphs not checked) |
| L6 | Make two sun charms ahead of time, one ritual each, to carry into a later job | add (a prepared thing) · charms · a ritual with the emblem · done in advance, spent later | **Composes today**: making plus a carried item; its use is L1's row | kj3bh-v1-ch158-read-2026-11-09/SOURCE_HANDOFF.md, ch162 P001–P058 |

L4's locator was corrected against the file after a reader's first version; L5's paragraph range is the one citation not pinned to paragraphs.

## The three counts

| Mark | Gu | Hogwarts | LOTM | All |
| --- | --- | --- | --- | --- |
| Composes today | 1 | 1 | 1 | **3** |
| Composes with a new property row | 6 | 2 | 3 | **11** |
| Needs a new effect | 2 | 3 | 2 | **7** |
| Actions | 9 | 6 | 6 | **21** |

**Coverage figure (composes today plus new property row): 14 of 21, about two thirds.** Read it as "most unlisted actions need data, not engine code", with the caveat above that the sample is not blind and leans early.

## Missing effects (feeds CBD92)

Six effects cover the seven actions. Default (proposal): each is a candidate in this order, since the first three were already named as shared gaps in the sizing audit.

| Code | Missing effect | Actions | Sizing gap | Nearest existing |
| --- | --- | --- | --- | --- |
| ME1 | A move can address a thing or a place, beyond self or foe | H2, H3 | G1 | `drop` records a thing's position |
| ME2 | Animate or summon a thing as an ally with its own chooser | H4 | G7, G1 | tempo `order`; contest `ports.choose` |
| ME3 | Set a third party's or a group's aim | A5 | G2, G1 | `handoff`; the proctor flag |
| ME4 | Carry harm along a bind (a relay between two bodies) | A7 | G1 | the grammar's `bind` on a relation, with no harm carried |
| ME5 | A look action that fills a knowledge field about a foe, with a confidence | L4 | G3 | tempo's study step; Notice at the opening |
| ME6 | A threat by display that moves a foe's choice without damage | L5 | none in the sizing table | `yield` and the refusal rules, which move a choice after a fight has started |

## What the new property rows share

The eleven property-row actions ask for few distinct rows: a bait and counter stance (A1), a pinned state (A4), attention on a fighter (A8), a carried stone as essence (A6), glare as cover for a throw (A9), obstructs (H5), a non-wand held implement (H1), a throwable charm (L1), a hold order (L2), a pendulum divination (L3), and one Gu row for a means (A3). Most are things, flags or orders a world adds as rows (CBD95); none names a world, so two or more would serve several (pinned, obstructs, attention, held implement).

## More to consider (separate from the count)

- **Re-run blind.** Give a second reader the same table rule with no candidate list, from a later arc of each book, and compare the share.
- **Gu is the most data-ready in this sample** (7 of 9 need no engine code) because its notes were written against its contest rows. That may say more about the notes than about the world.
- **ME1 is the largest single lever** in this sample (three actions touch it directly or indirectly), which matches the sizing audit's R1.
