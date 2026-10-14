# Nonhuman starts: engine requirements and more (2026-10-14)

Weibao: "required stuff for non human starts and more? lIke engine stuff and
more?"

Status: source-read audit plus proposals. Nothing here is implemented,
accepted or browser-verified. Code locators come from a read-only sweep of
`src/` on 2026-10-14 (no build, no tests run). Design owners this builds on:
[shared foundations U01/U03](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md),
[origins: tree and other bodies](ORIGINS_AND_WORLD_TIMELINES.md#tree-and-other-bodies-change-available-actions),
[genetics and brood play](../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md),
[identity and control](PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md),
and start kinds SA14-SA19 in
[intro flow round 6](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#sa-audit-of-start-kinds).

## Short answer

The engine has two layers. The newer simulation layer already models a body
as a record (`form`, `ownerId`, `controllerId`, `hands`, `mobile`, plus
flags such as `photosynthetic`), and one nonhuman start (reedling) and one
possession (the clay vessel Tern) work through it. The original game layer
(stats, equipment slots, sleep, death, combat, creation screen, saves) still
treats the player as one humanoid `Hero`. Most of the required work is
routing that original layer through the body record, so a start can say
"this body can't hold a sword" and every system agrees.

## F: what exists today (verified by source read)

| Code | Seam | Locator | What it gives |
| --- | --- | --- | --- |
| F1 | Native body read | `src/main.js:535-538`, `:1077` | `currentNativeBody()` reads `simulation.people.player.body`; falls back to race, 2 hands, mobile, player-controlled, life stage from age |
| F2 | Reedling origin | `src/backlog_expansion_body.js:222-238` | Working nonhuman start: photosynthetic, no air breathing, reed sap resource. Only at a fresh creation; the cosmetic scaffold stays human |
| F3 | Vessel and possession | `src/backlog_expansion_body.js:35-36`, `:344-389` | Immobile clay vessel; player body parked, body and vitals swapped, host incapacitated, swap back on return |
| F4 | Multi-body mind | `src/realm_traveler_profiles.js:5`, `:422-505` | Modes physical / projection / alternate_body / shared_body; bodies list `functions` (`hands.grip`, `travel.physical`); up to 7 bodies per mind. Detached prototype, all bodies human |
| F5 | Start admission by form | `src/structured_pack_runtime.js:18,30,66` | Packs can admit starts by `forms` and `lifeStages`; owner and controller must be `player` |
| F6 | Realm filters by form | `src/realm_boundary_rules.js:51,77,100,115` | Realm edges can allow or block body forms |
| F7 | Body, controller, soul kept apart | `src/feature_expansion_book_cultivation.js:803-819` | Rule snapshots carry `actorId`, `bodyId`, `controllerId`, `soulId` |
| F8 | Capabilities from sources | `src/capabilities.js`, `src/body_progression.js:20` | Traits, bloodlines, conditions grant capabilities; `body.hand_control` already exists |
| F9 | Life and rebirth | `src/simulation.js:51-59`, `:483`, `:568-583` | People have life, body, vitals, life policy; transitions can reset body (`kind: rebirth`) |

## B: what blocks nonhuman starts today

| Code | Blocker | Locator | Effect |
| --- | --- | --- | --- |
| B1 | One global `Hero` | `src/data/character.js:21`; `hero_id` in `src/models/combat.js` (27 sites), `src/heir_inheritance.js:44` | Only one controlled person exists in the original layer |
| B2 | Humanoid races only, cosmetic | `src/races.js:3-12`, `:58-239`; `src/components/bio_component.js` | Race can't change verbs; bio is age, height, race, gender |
| B3 | Fixed humanoid stats and global skills | `src/models/stat_haver.js:6-74`; `src/data/skills.js` | Running, Weightlifting, Unarmed, Literacy assume legs, arms, eyes; skills are one global set, not per body |
| B4 | Fixed equipment and tool slots | `src/display.js:219-223`; `src/data/character.js:5`; `src/items.js:128-136` | Head/torso/arms/legs/feet slots and axe/pickaxe tools for everyone |
| B5 | Sleep, bed and death | `src/main.js:2767-2844`, `:3721-3735` | Health 0 means "lost consciousness" and a bed respawn; rest assumes sleeping |
| B6 | Movement ignores `mobile` | `src/main.js:2152` | Native travel lets an immobile body walk; only simulation and realm hosts check it |
| B7 | Single humanoid combatant | `src/models/combat.js:141-398`; `src/native_battle.js:16-19` | One fighter, shield block, weapon or unarmed |
| B8 | Hard `form === 'human'` checks | `src/proto23_world_host.js:20,88-89`; `src/book_world_paradise_host.js:23,61`; `src/book_world_mol_state.js:11`; `src/world_completion_lens_facts.js:31`; `src/foundation_interaction_content.js:39,58`; `src/book_world_paradise_campaign_facts.js:107`; `src/feature_expansion_book_host.js:41` | These worlds reject or overwrite a nonhuman body; several hosts default a missing body to human |
| B9 | Hands and mobility checked ad hoc | `src/status_care_facts.js:28`; `src/exchange.js:7`; `src/original_frontier_field_content.js:125`; `src/foundation_interaction_policy.js:54-55` | Each system writes its own "hands >= 2" test |
| B10 | Human-shaped text and greetings | `src/main.js:2123-2128` (also checks `"middle-aged"` while the panel offers "middle aged", so it never matches); `index.html:80-134` | NPCs greet by gender and age; creation panel offers fixed human options |
| B11 | Heirs are new humans | `src/heir_inheritance.js:39-115` | Succession writes into `person.main_character` |

## E: required engine pieces (proposals, ranked by how much they unlock)

| Code | Piece | What it means | Unlocks |
| --- | --- | --- | --- |
| E1 | **Body record as the one truth** | `simulation.people.player.body` owns form, functions and limits; the original layer reads it instead of race/height. Missing body means human only in old saves, by migration | Everything below |
| E2 | **Function queries instead of form checks** | Systems ask `can(body, 'grip')`, `'speak'`, `'move'`, `'see'`, `'read'`, `'eat'`, `'wear.head'` rather than `form === 'human'`. Reuse F4's `functions` list and F8 capabilities. Replaces B8 and B9 | Monsters, spirits, objects, infants |
| E3 | **Action requirements declared by function** | `GameAction` and location activities state needed functions (hands for woodcutting, speech for haggling). Actions a body can't do hide or show why; an alternate verb can satisfy the same goal (roots gather water) | Different verbs per body (SA14) |
| E4 | **Body-defined slots** | Slots come from the body: a wolf has collar and saddle, a sword has hilt wrap and sheath, a slime has engulfed items. Items declare which slots or body fits they suit | Equipment for any form |
| E5 | **Intake and upkeep per body** | Food, sunlight, mana, souls, worship, fuel, nothing. Hunger stays default-off and never kills (food direction 2026-10-13); the body says what counts as a meal | Reedling, constructs, spirits |
| E6 | **Rest, downtime and defeat per body** | Sleep, dormancy, recharge, none. Health 0 maps to the body's defeat: unconscious, scattered, dormant, cracked, banished; respawn point is the body's anchor, not always a bed | Ghosts, objects, dungeon cores |
| E7 | **Presence and reach** | A body can be immobile with a reach radius (tree, house, core), carried (sword, familiar), or present in several places (brood). Travel checks `move` or a carrier | Objects, places, collectives |
| E8 | **Controller separate from body** | Generalize F3 and F7: one controller, zero or more bodies, each with its own vitals; NPC bodies can be lent, shared or possessed. `hero_id` becomes "the current controlled body" | Possession, host/patron, brood, AI guide |
| E9 | **Per-body stats and skill mapping** | Stats come from the body template; skills keep XP on the controller (knowledge) or the body (trained muscle) as each skill declares. Running on legs may not carry to a snake, but Literacy does | Body change without lost progress |
| E10 | **Communication and how NPCs read you** | Speech, signs, telepathy, writing, none. NPCs react to what they can observe (U01, X01): a talking cat is alarming in Village, normal in a fae world. Greetings and `%HeroName%` text read the body | Social play as a nonhuman |
| E11 | **Combat by body** | Combatant built from body functions: natural weapons, no shield arm, swarm members as several fighters, an object fights only through a wielder | Monster and brood combat |
| E12 | **Life stage and lifespan by body** | `chronicle.js` lifespan 80 and age 18 become body fields; immortal, short-lived, molting, growth stages | Infants, beasts, spirits |
| E13 | **Body change transitions** | Evolve, transform, return to human, gain a body, lose one. Each declares what carries (U12 carriers, V06): no duplicated items, no invented memories | Monster evolution, reincarnation |
| E14 | **Save schema and migration** | Body record versioned; old saves migrate to `form: human` from race; reedling and Tern records keep working. Persistence gate: save, reload, export, literal import | Required before any of the above ships |
| E15 | **Creation and admission** | Creation shows body choices the world admits (F5); field effects shown where the body matters (CR4); hosts in B8 declare admitted forms rather than hard-coding human | Choosing a nonhuman start at all |

## K: what each start kind needs

| Start kind (SA code) | Needs first | Also needs |
| --- | --- | --- |
| Monster or beast (SA14) | E2, E3, E4, E11 | E10 social reaction, E13 evolution |
| Plant or rooted spirit (SA14) | E5, E7 immobile reach | E10 signals, E6 dormancy |
| Spirit or ghost (SA18) | E6 defeat, E7 reach, E10 | E8 possession, E2 "can't touch" |
| Object, weapon, place (SA15) | E7 carried or fixed, E8 act through holder | E4 slots on the object, E11 via wielder |
| Dungeon core or haunted house (SA15) | E7 territory reach, facility as body | Visitors as encounters, idle building jobs |
| Collective, hive, brood (SA16) | E8 many bodies, E11 many fighters | Per-member vitals, autonomy dial (G9) |
| System, AI or patron (SA17) | E8 controller without body | Influence verbs, host consent and disagreement |
| Infant or child (SA19) | E12 stages, E3 limits | Caregiver as an NPC with their own time (X06) |
| Construct or golem | E5 fuel, E6 recharge | E13 upgrades as parts |

## M: more to consider beyond the engine

| Code | Consideration |
| --- | --- |
| M1 | **Idle loop per body.** Each form needs a good offline activity: a tree grows roots, a core builds rooms, a brood forages, a sword gains its wielder's XP. A body with nothing to queue is a dead start |
| M2 | **Verbs worth having.** The point of SA14 is different verbs. Each nonhuman start needs at least a few actions humans can't do, not just human actions with bans |
| M3 | **Law and status per world.** Monster rights, ownership of a sentient object, a beast's legal standing. Default: what the world's canon says; dial for AU |
| M4 | **Recognition.** Who knows you are a person inside the body, by what evidence, and whether they are right (X01, OS14) |
| M5 | **Body choice versus earned body.** Some starts pick the body at creation; others reach it through play (possession, evolution, death). Both stay reachable (everything possible, reasonably) |
| M6 | **Gear and economy fit.** Shops need to sell things this body can use or the money loop dies; a per-world dial for nonhuman goods |
| M7 | **Teaching the body.** First minutes show what the body can and can't do through play, not a manual (TE, S5 adaptation) |
| M8 | **Canon sources.** Start-as-X catalog lane is gathering sources for monster, object and other starts ([catalog](../research/START_AS_X_SOURCE_CATALOG_2026-10-14.md), resolves when written) |
| M9 | **Balance is per world.** No universal penalty for a strange body (S5); a weakness exists where the world says so |
| M10 | **Performance.** Brood and multi-body play run members at the lightest fidelity that stays believable (OS15) |
| M11 | **Sealed truths.** A changed or randomized truth about what a body really is gets sealed like any world secret |

## Suggestions (separate from the palette)

1. Do E1 + E2 + E14 first as one foundation slice: body record as truth,
   function queries, migration. It's invisible but every start kind sits on it.
2. First playable nonhuman start after that: a beast (wolf or cat) in
   Village. It touches E3, E4, E10, E11 at a small scale and uses existing
   content, so it proves the seams before a dungeon core or brood.
3. Fix the B8 hard human checks as each world becomes active, by declaring
   admitted forms (F5), rather than in one sweep.
4. Small existing bug to fold into that slice: the `"middle-aged"` mismatch
   in `src/main.js:2127`.

## Round 2: more to consider and dispatched lanes (2026-10-14)

Weibao: "more to consider? send out codex agents accordingly". Four Codex
lanes in [nonhuman-starts-2026-10-14](../gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md):
engine spec ([ENGINE_SPEC](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md)),
play per body kind ([PLAY](NONHUMAN_STARTS_PLAY_2026-10-14.md)), canon
nonhumans by world ([BY_WORLD](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md)) and
monster-protagonist mechanics, Tensura first
([MECHANICS](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md)). Links resolve
when the lanes write.

New angles to check against those returns (proposals):

| Code | Consideration |
| --- | --- |
| N1 | **Senses shape the UI.** A bat body hears what a human sees; a tree feels touch and light. The same location text can render through the body's senses, with unknown things shown as what this body can tell |
| N2 | **Scale changes the world.** A rat's Village is huge and full of walls with gaps; a giant's is cramped. Size can gate places and routes both ways |
| N3 | **Body parts as inventory.** Shed scales, horns, sap, venom and feathers are items the body makes; harvesting your own body is a craft route with a recovery time |
| N4 | **Being an item to others.** A sentient sword or familiar can be bought, stolen, inherited or lost by NPCs; ownership by others is a state, not a game over |
| N5 | **Partner bond as a stat.** Familiars, wielders and hosts have a relationship value that changes what they let you do (lend hands, follow advice, carry you) |
| N6 | **Mixed parties.** A human life and a nonhuman life linked as co-protagonists (rider and mount, witch and familiar), switchable seats per LS3 |
| N7 | **Learning human things.** Literacy, money and manners can be learned by a beast or spirit as a slow route; some bodies can't, and alternatives exist (a scribe NPC) |
| N8 | **Instinct as a pull.** A body can carry urges (hoard, hunt, migrate, sleep in winter) shown as gentle suggestions or bonuses, never forced actions unless a premise selects it |
| N9 | **Habitat and weather.** Water, light, cold and mana density matter to some bodies; a place can be home to one body and hostile to another |
| N10 | **Death and return per form.** Ghosts can't die the usual way; objects can be repaired; brood members are replaceable but mourned. Each form says what loss costs |
| N11 | **Start with a human memory or none.** Reincarnated with human memory (Tensura style), native monster mind, or a monster slowly gaining a mind: three knowledge modes, each its own feel |
| N12 | **Name and title.** Some worlds treat naming as power (Tensura). A nameless start can earn a name; who names you matters |
| N13 | **Hunters and quests aimed at you.** A monster start can see the adventurer side from outside: bounties posted on you, heroes sent your way (VS5 for monsters) |
| N14 | **Pets and livestock layer.** The cheapest nonhuman start is a village animal (dog, cat, chicken) with a human household; pure life-sim, tiny engine cost |
| N15 | **Return to human is a route, not a goal.** Some players want to stay a monster forever; the game never assumes becoming human is the ending |

## Round 3: more lanes and Paradise (2026-10-14)

Weibao: "more to consider? send out more codex agents accordingly, bring
Reincarnation paradise to priority world too". Two more nonhuman lanes:
body change during play ([TRANSFORMATION](NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md))
and senses, scale and desktop UI ([SENSES_SCALE_AND_UI](NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md)).
Reincarnation Paradise joined the canon-first tier
([direction](../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13));
its lanes in [paradise-priority-2026-10-14](../gm/dispatch/paradise-priority-2026-10-14/COMMON.md)
write a [canon priority plan](paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md) and
[beings, pets and bodies](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md).

More angles (proposals):

| Code | Consideration |
| --- | --- |
| N16 | **Paradise as the lore engine for bodies.** A contract world can hand out a body as a mission term, a reward or a penalty; this explains nonhuman starts in worlds that have no native reason for them |
| N17 | **Pet seat.** Playing the contractor's pet or summon (a Baha-style start) is a familiar start (N5, N6) with its own growth line beside the owner |
| N18 | **Mission bodies.** A derived-world mission can assign a local body for its length, then return the contractor's own body; tests E8 and E13 with a clean ending |
| N19 | **Race as an earned option.** Race change items or bloodline awakenings as earned routes, kept reachable for players who want them from the start (everything possible, reasonably) |
| N20 | **Body tiers and access tiers stay separate.** Paradise keeps rank, body strength and source growth apart (NS01-C03); nonhuman bodies follow the same split |
| N21 | **Unequal bodies in a party.** A team with a beast, a ghost and a human splits work by functions (E2), which gives party play real roles |
| N22 | **Body debt.** A borrowed, rented or contracted body can carry upkeep, a return date or an owner's claim |
| N23 | **Who pays for a strange body.** Shops, inns and transport priced per body (size, diet, danger) give the economy texture without bans |

## Round 4: first returns, more lanes (2026-10-14)

Weibao: "more to consider? send out more codex agents accordingly, expand and
consider accordingly? Save accordingly?"

**Returned so far (proposals, not accepted):**

- [Engine spec](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md): F1-F9 confirmed
  with corrections; 9 more blockers found (20 B entries total), including
  missing tests for the reedling, possession and traveler routes. Body template
  schema with 9 example records, a query API and 10 touch groups ordered by
  blast radius, 12 save touchpoints. Two sized slices: Slice 1 (P1-P5, one
  authoritative body plus migration, no new start kind) and Slice 2 (P6-P9, a
  Village wolf with scent foraging, collar gear, bite combat and full
  save/export/import). Risks R1-R6, questions Q1-Q4.
- [Monster-protagonist mechanics](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md):
  Tensura engine shapes TM1-TM7 (Predator as a pipeline, naming vs bonding vs
  evolution as separate outcomes, Great Sage as delegation), 19 comparison
  works, patterns NM1-NM12. It proposes a slime loop (sense, gather, dissolve,
  deliver) as a candidate beside the wolf.
- [Play per body kind](NONHUMAN_STARTS_PLAY_2026-10-14.md): BK1-BK15 body
  profiles written (hound through clever rat); later sections still in progress.

Still running: canon by world, transformation, senses/UI, and both Paradise lanes.

**New lanes** in [nonhuman-starts-2026-10-14](../gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md):
[society, law and economy](NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md),
[bonds and parties](NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md),
[progression and balance](NONHUMAN_PROGRESSION_AND_BALANCE_2026-10-14.md),
[monster side](NONHUMAN_MONSTER_SIDE_2026-10-14.md); and in
[paradise-priority-2026-10-14](../gm/dispatch/paradise-priority-2026-10-14/COMMON.md):
[derived worlds and missions](paradise-hub/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md),
[hub life, economy and people](paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md).

More angles (proposals):

| Code | Consideration |
| --- | --- |
| N24 | **Wolf and slime are not rivals.** Wolf tests gear, combat and social signaling; slime tests absorption and a production loop. Either can follow Slice 1; both stay reachable |
| N25 | **Test debt first.** The spec found no dedicated tests for reedling, Tern or the realm traveler. Writing them before Slice 1 protects the only working nonhuman routes |
| N26 | **Enemies are a free body library.** Every enemy type in `src/enemies.js` is a body template waiting to happen; a monster start can reuse its stats and drops |
| N27 | **Same species, three seats.** A wolf can be the player, a companion or a foe under one template, which keeps NPC and player rules equal (U10) |
| N28 | **Bodies as earned cheats.** A second body, a form or a race change can be a cheat acquired through play (feature unlock process), not only a start choice |
| N29 | **Delegation as a body power.** Great Sage style guides and brood minds turn queued jobs into the body's own skill; an idle game already has the queue |
| N30 | **Paradise missions as the safe test bed.** A mission body that returns at extraction (N18) tests body swap without risking the main save's body |
| N31 | **One body per world first.** Each priority world gets one well-made nonhuman start before a catalog: house-elf or ghost for HP, familiar or warforged for D&D, pet or summon for Paradise |

## Round 5: cross-lane synthesis and more angles (2026-10-14)

Weibao: "more to consider? Save and extend accordingly"

**Newly returned (proposals, not accepted):**

- [Play per body kind](NONHUMAN_STARTS_PLAY_2026-10-14.md) is complete: BK1-BK15
  profiles, cross-cutting NP1-NP14, transformation, laptop UI, darker-premise
  dials, ranked slices NS1-NS5 (hound, rat, sapling, practice blade, child).
- [Canon nonhumans by world](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md) is complete:
  W01-W16 from Harry Potter to Reverend Insanity, rule patterns NC1-NC14,
  extensions NX1-NX10, ranked canon slices (HP free house-elf, MoL aranea
  apprentice, JJK cursed corpse, D&D sentient item, FMA armor-bound soul).
- [Paradise beings, pets and bodies](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md):
  start records BS1-BS5 (pet or summon, nonhuman Contractor, bloodline
  awakening, recruited derived-world monster, hub creature), PB1-PB5.
- In progress: progression, Paradise derived worlds and missions; not yet
  written: transformation, senses/UI, society, bonds, monster side, Paradise
  canon plan and hub life.

### Where the lanes agree

| Code | Agreement | Lanes |
| --- | --- | --- |
| C1 | A scent-led beast is the cheapest strong first nonhuman start: senses change a result, one witness responds, one idle routine | Engine (Village wolf), Play (NS1 hound), Paradise (PB3 scent/parcel) |
| C2 | Teach verbs before bans: a body that mostly hides human buttons is a failed start | Engine (R6), Play (NP1), Paradise (PB3) |
| C3 | Body, bond and legal status are three records, never one score | Play (NP8), Canon (NC8, NX4), Paradise (PB1) |
| C4 | Defeat, repair, revival and replacement are different outcomes per form | Play (NP7), Canon (NC5, NC13), Paradise (PB4) |
| C5 | Non-food fuels (blood, souls, anchors) must not sneak hunger death back in | Play (NP6), Canon (NX2), food direction 2026-10-13 |
| C6 | A quiet nonhuman life is a full arc; becoming human or strong is optional | Play (NP11), Paradise (PB5), N15 |
| C7 | Personhood, animation and an independent mind are separate permissions | Canon (NC1, NC2, NX8) |

### Combined first-slice shortlist (proposal)

All need Slice 1 (body record, function queries, migration) first. Ranked by
playable value per effort and fit with the canon-first order; every option
stays reachable.

| Rank | Slice | Why | Source |
| --- | --- | --- | --- |
| 1 | Original Village hound or wolf | Smallest proof of C1 using existing Village content; all three lanes converge | Engine Slice 2, NS1 |
| 2 | HP free house-elf worker | Top canon world; household work loop needs little combat rework | Canon S1 |
| 3 | Paradise pet or summon (BS1) | Newly prioritized world; pet seat beside an owner tests bonds | Paradise BS1, N17 |
| 4 | Speaking practice blade or D&D sentient item | Proves carried bodies and holder separation | NS4, Canon S4 |
| 5 | MoL aranea or slime production loop | Different body plus a real trade output | Canon S2, Mechanics S1 |

### More angles (proposals)

| Code | Consideration |
| --- | --- |
| N32 | **Body fixtures for every test.** One shared fixture set (human, reedling, Tern, hound, sapling, blade) used by each new system's tests, so new code can't quietly assume a human again |
| N33 | **Body lint.** A static check that flags new `form === 'human'` or `hands >= 2` literals in `src/`, pointing to the function query instead |
| N34 | **Start record checklist.** Each nonhuman start fills the same fields before it ships: source and era, body template, control seat, mind kind, needs, defeat outcome, first useful verbs, witness, idle routine, save decision |
| N35 | **Waiting is a decision.** A carried sword or sealed beast waiting on others needs something worth doing meanwhile (NX10): sense, plan, signal, train a mental skill |
| N36 | **Observation hazards.** Some bodies harm whoever perceives them (LOTM, JJK). Exposure needs a cause, protected channels and real witnesses, not a scare line (NX5, NC12) |
| N37 | **Credentials go stale.** Soul signatures, maker marks and registrations can lag a body change; border guards and wards read the record, not the truth (NX6) |
| N38 | **Arrival needs a habitat.** A body that can travel still needs a place to live at the destination: water, mana density, size (NX9) |
| N39 | **Copies are not restorations.** Summoning the same record again is not bringing the same person back; memory provenance travels with the copy (NX3, NC10) |
| N40 | **Native institutions as content.** Aranea silk trade, goblin smiths and summon communities give nonhuman starts their own economy instead of only human shops (NC14) |
| N41 | **One body, many kinds.** An undead beast, a spirit sword or a shapeshifting child combine kinds; labels describe functions, not exclusive species slots (NP13) |
| N42 | **Offspring are not free control.** Buds, clones, offspring and copied minds differ; reproduction doesn't hand the player extra bodies by default (NP14) |

## Round 6: transformation and senses returns, other stuff (2026-10-14)

Weibao: "more to consider? Expad and save accordingly? other stuff and more?"

**Newly returned (proposals, not accepted):**

- [Transformation and body change](NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md):
  12 kinds TF1-TF12 (partial change, reversible form, cyclic, crisis or
  takeover, incarnation, chimera, evolution, reincarnation, possession,
  second body, losing a body, repair and return), two carry tables, a
  transition record, TX1-TX16. Core rule: changing one body's configuration,
  getting a different body and changing who controls it are three different
  events.
- [Senses, scale and UI](NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md): one
  truthful perception view, sense palette, scale routes, a Body view adapted
  from the equipment panel at 1366x768 and 1920x1080, names and greetings,
  first-minutes teaching, SU1-SU10+ and SS1-SS5 with the browser checks each
  would need.

Still running: progression and Paradise missions (partial), society, bonds,
monster side, Paradise canon plan and hub life.

### More agreements

| Code | Agreement | Lanes |
| --- | --- | --- |
| C8 | Generalize the Tern possession into a control lease with separate body reserves and a failed-return case before any multi-body play | Engine (R2), Transformation (S2, TF9) |
| C9 | Second bodies wait until switching focus can't duplicate stock, fuel, XP or knowledge | Engine (R5), Transformation (S4) |
| C10 | Owner, holder, partner and controller are four labels; changing holder isn't game over | Senses (SU7), Transformation (TX4), Canon (NX4) |
| C11 | A first transformation should be one reversible two-form change, each form with a useful action | Transformation (S1), Play transformation section |

### Other stuff: beyond the single nonhuman start (proposals)

| Code | Consideration |
| --- | --- |
| OT1 | **Nonhuman-majority worlds.** A world where every playable seat is an animal, spirit or monster (warren, forest court, dungeon ecology, spirit realm), so humans are the strange body |
| OT2 | **Inverted minority.** A human start inside a monster nation (Tempest-style) or a Paradise derived world where humans are rare; tests the same recognition and law rules from the other side |
| OT3 | **Time scale per body.** Trees, dragons and elves live centuries and suit chapter skips; insects and mayflies live hours and suit fast generations. Idle play fits both; the body sets the clock grain |
| OT4 | **Species from the function vocabulary.** Procedural species built from the engine spec's function list (senses, intake, movement, slots), joined to the [procedural generation status](../PROCEDURAL_GENERATION_STATUS_2026-10-13.md) work |
| OT5 | **Light ecology.** Prey, plants and rivals that respond to a monster player's hunting or gathering at village scale, without a full food-web simulation |
| OT6 | **Seasons for bodies.** Hibernation, molting, migration and blooming as idle phases, with useful offline progress during them |
| OT7 | **Places inside a body.** Inner worlds (zanpakuto spirits, mindscapes, a dungeon core's own halls): a body can contain a location others visit |
| OT8 | **Death as travel.** Ghost and spirit starts link to afterlife worlds (Soul Society, a Paradise death rule, an underworld), so losing a body opens a route |
| OT9 | **Body codex.** An opt-in record of bodies the player has lived in, with what each learned; meta-progression that never gates a start for players who want everything open |
| OT10 | **One event, many bodies.** The same village fire seen as the hound, its owner and the arsonist across linked starts (LS7 witness starts) |
| OT11 | **Bodies as authored data.** Body templates live in content files with a short authoring guide beside [ability authoring](ABILITY_AUTHORING.md), so a new species is content work, not engine work |
| OT12 | **Sense cues in presentation.** The Proto23 ink cue pattern extended to scent, echo and mana cues, using existing effects settings |
| OT13 | **Two queues at once.** Pet and owner, or a sword and its wielder, can each run an idle queue, so linked play doubles idle texture without doubling clicks |
| OT14 | **Accessibility of filtered text.** Sense-filtered descriptions stay screen-reader friendly and can be switched to plain text |
| OT15 | **Cost ceilings.** Brood size, number of linked bodies and per-body simulation detail have per-world caps that keep save size and tick time bounded |
| OT16 | **Mixed-world crossings.** A body from one world in another (a house-elf in Paradise, a cursed corpse in Village) uses habitat (N38) and credential (N37) checks instead of a ban |

## Round 7: all first lanes returned; kin, micro and more (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle micro stuff too? Non human relationships
(monster family and more?)"

**Returned (proposals, not accepted).** All 14 lanes from rounds 2-4 are done.

| Doc | Key content | Its first slice |
| --- | --- | --- |
| [Society, law and economy](NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md) | Status palettes, ownership of sentient beings (N4), recognition and rumor, prices per body, body debt, fear and standing, SL1-SL16 | One recognition-and-payment join for the Village beast |
| [Bonds and parties](NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md) | Nine bond kinds and what partners lend, bond as state, pet and owner seats, roles from functions, NPC nonhumans under the same rules | Hound plus caretaker: hound retrieves, caretaker handles grip and speech, either can decline |
| [Progression and balance](NONHUMAN_PROGRESSION_AND_BALANCE_2026-10-14.md) | Every native skill mapped across BK1-BK15, stat templates vs world power scaling, evolution beside cultivation, relative idle rates, PG1-PG15 | Hound gait practice vs retained Literacy proves body vs knowledge skills |
| [Monster side](NONHUMAN_MONSTER_SIDE_2026-10-14.md) | Being hunted, monster ecology and society, dungeon cores and lairs, existing enemies as beings, crossing sides, MS1-MS24 | A wolf-rat resident, a mana patch, a crop claimant and a named hunter |
| [Paradise canon plan](paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md) | Source map, current footprint vs canon, SRP1-SRP32, ARP1-ARP10, ranked features | One source-era hub-return slice before a new destination |
| [Paradise derived worlds](paradise-hub/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md) | Chronological mission catalog, mission engine shape, overlap with Naruto, Bleach and others, original templates, mission bodies | A frozen contract card for the next mission |
| [Paradise hub life](paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md) | Daily life, currencies and grades, progression between missions, people from a non-Su Xiao seat | Room and neighborhood routine |

### More agreements

| Code | Agreement | Lanes |
| --- | --- | --- |
| C12 | The hound is the shared first-slice anchor: society, bonds and progression each pinned their first proof onto it | Society S1, Bonds BDS1, Progression PSG1, plus C1 |
| C13 | Body practice and retained knowledge are separate skill owners | Progression PSG1, Engine Q2, Transformation TX6 |
| C14 | Helpers can say no: partners, caretakers and minions decline, withdraw or leave | Bonds BDS1/BDS5, Play NP10, VS4 |
| C15 | One persistent individual can be foe, neighbor and ally over time | Monster side MSS2, N27 |
| C16 | Paradise mission bodies need a source-specific lease first | Society S5, Paradise missions S4, C8 |

### Nonhuman relationships and monster family (proposals)

A dedicated lane is writing
[kin and relationships](NONHUMAN_KIN_AND_RELATIONSHIPS_2026-10-14.md). Starting angles:

| Code | Consideration |
| --- | --- |
| NR1 | **Family shape follows the body.** Pack, pride, clutch, hive, grove, forge siblings, ghost household; each sets who counts as kin and who leads |
| NR2 | **Kin by making.** A smith's blades, a necromancer's skeletons, a homunculus maker's children: maker and made have obligations both ways |
| NR3 | **Cross-species adoption.** A wolf raised by a farmer, a human raised by spiders; each side learns the other's signals |
| NR4 | **Mixed families.** Monster-human households with children who are both or neither; the world's law decides how they're treated |
| NR5 | **Young that grow differently.** Offspring can evolve along a different branch than the parent; the family has to adjust |
| NR6 | **Pack politics.** Rank, challenge and care inside a pack; leaving the pack is a real choice with costs and a road back |
| NR7 | **Mourning in kind.** A pack howl, a hive's silence, a grove dropping leaves; grief takes the body's form |
| NR8 | **Enemies have kin.** Killing a monster can bring its family: revenge, mourning or a strange gratitude |
| NR9 | **Friendship across bodies.** A human child and a ghost, a guard and a talking sword; trust grows through what each can actually do for the other |
| NR10 | **Romance only as a dial.** Courtship and mating stay a world or AU dial with consent, never a default system |
| NR11 | **Siblings who share a source.** Brood mates or forged siblings can share a sense, a weakness or a name |
| NR12 | **The player's old family.** A reincarnated human-memory monster may meet its former human family, who don't recognize it (OS14) |

### Subtle micro details (proposals)

A lane is writing [micro details](NONHUMAN_SUBTLE_MICRO_DETAILS_2026-10-14.md)
per body kind. Starting angles:

| Code | Consideration |
| --- | --- |
| MM1 | **Comfort spots.** A sunny step for the hound, a damp corner for the slime, a high beam for the rat; resting there gives a small bonus and a line of text |
| MM2 | **Body weather.** Wet fur, sun-warm bark, rust after rain, a ghost thin at noon; small states that tint text and nudge one number |
| MM3 | **NPC small reactions.** A child offers a scrap, a cat hisses, the smith checks the blade's edge when passing; reads actual relationship state |
| MM4 | **Habits become skills.** Repeating a small act (circling before sleep, marking a path) turns into a named minor skill over time |
| MM5 | **Gear wear in kind.** A collar loosens, a hilt wrap frays, a shell scratch stays as a mark of history |
| MM6 | **Scraps economy.** Tips, leftovers and favors as tiny income routes for bodies that can't use coins easily |
| MM7 | **Noise rules.** Micro lines rotate, rarely repeat and can be turned down in settings, so texture never floods the log |

### Other dispatched lanes this round

[Nonhuman-majority worlds](NONHUMAN_MAJORITY_WORLDS_2026-10-14.md) (OT1, OT2,
OT16), [clocks, lifespans and seasons](NONHUMAN_CLOCKS_LIFESPANS_AND_SEASONS_2026-10-14.md)
(OT3, OT6, E12) and [bodies as authored data](NONHUMAN_BODY_AUTHORING_2026-10-14.md)
(OT4, OT11, N26, N32-N34). Sessions in the
[dispatch folder](../gm/dispatch/nonhuman-starts-2026-10-14/runs/SESSIONS.md).

## Round 8: subtle stuff, other stuff, four more lanes (2026-10-14)

Weibao: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle stuff too?"

No new returns since round 7; the five round-7 lanes are still writing.

**Dispatched** (sessions in [SESSIONS](../gm/dispatch/nonhuman-starts-2026-10-14/runs/SESSIONS.md)):
[synthesis and roadmap](NONHUMAN_SYNTHESIS_AND_ROADMAP_2026-10-14.md) (one
ordered slice plan, dependency graph, conflict and duplicate registers),
[start specs](NONHUMAN_START_SPECS_2026-10-14.md) (implementation-ready
records and first-hour scripts for the Village hound, the HP free house-elf and
the Paradise pet seat), [minds and cognition](NONHUMAN_MINDS_AND_COGNITION_2026-10-14.md)
and [making and building without hands](NONHUMAN_MAKING_AND_BUILDING_2026-10-14.md).

### Subtle stuff (proposals)

| Code | Consideration |
| --- | --- |
| SB1 | **Misread signals.** A wagging tail read as friendly when it's nervous; a still ghost read as gone. NPCs act on what they think they saw, and the player can learn which signals land |
| SB2 | **Being underestimated.** People talk freely in front of a dog or a sword; overheard plans are a quiet information route (RV1 for bodies) |
| SB3 | **Small trust tells.** An NPC who once kicked the hound now leaves a bowl out; changes show in actions before any relationship number moves |
| SB4 | **Body memory.** The hound flinches at the stick that hit it; the blade warms in a familiar grip. Past events leave small reactions tied to real records |
| SB5 | **Silence as speech.** For a nonverbal body, choosing not to act (not barking, staying hidden) is a visible choice with consequences |
| SB6 | **Scent and sound trails.** Where someone went, who visited a house, what was cooked: low-key information that only some bodies get |
| SB7 | **Time felt differently.** A ghost loses track of days; a tree notices seasons, not hours. Log text can match the body's sense of time |
| SB8 | **Belonging marks.** A collar tag, a ribbon on a blade, a painted shell: small items that tell NPCs this being has someone, and change how they treat it |
| SB9 | **Shame and pride in kind.** A cat that misses a jump, a sword drawn and not used; small status moments other beings notice |
| SB10 | **Weather of the household.** The hound senses the family's mood (a quarrel, a sick child) before anyone says it, and can respond |
| SB11 | **Leftover humanity.** A reincarnated monster keeps one human habit (sitting at a table, humming) that NPCs find uncanny or charming |
| SB12 | **Names that stick.** Villagers give the nonhuman a nickname before it has a name; which one sticks depends on what it did first |

### Other stuff (proposals)

| Code | Consideration |
| --- | --- |
| OT17 | **Making without hands.** Silk, resin, burrows, nests, grown structures and dungeon rooms as craft routes (lane dispatched) |
| OT18 | **Earned manipulators.** Prosthetic hands, a mage hand spell or a trained helper as routes to hand-only work; never the only route |
| OT19 | **Homes in kind.** Dens, nests, hives and lairs as facilities with comfort and upkeep, reusing housing (`src/models/location.js` housing) |
| OT20 | **Festivals and rites for nonhumans.** Blessing of the animals, a ghost's remembrance night, a naming ceremony; calendar events reusing the existing calendar service |
| OT21 | **Nonhuman jobs board.** Village posts work any body can take (guard the coop, find the lost ring, scare the crows), so the economy opens through ordinary chores |
| OT22 | **Rumor about you.** Village talk about the strange dog or the talking sword spreads by real contacts and changes who comes looking |
| OT23 | **Becoming a local legend.** A long nonhuman life can leave a legend later starts inherit (LV2, SS1), like the old dog everyone remembers |
| OT24 | **Death of a beloved animal.** If the hound dies, its family remembers; its grave, collar and trained pup are carriers for later starts |
| OT25 | **Shared world, different readings.** The same Village day log reads differently for human, hound and ghost players, from one simulation |

## Round 9: cheats, overarching frame, implementation implications (2026-10-14)

Weibao: "more to consider? other stuff and more? Cheats that would show stuff
like these and more? MOre to consider save and extend accordingly Send out
codex as usesful? Subtle stuff too? Overarching stuff? Implementation
implciations and more?"

**Returned:** [clocks, lifespans and seasons](NONHUMAN_CLOCKS_LIFESPANS_AND_SEASONS_2026-10-14.md)
(current time code, clock grain per body, seasons as idle phases, mixed clocks,
CK1-CK18). Its first proof: separate body maturity, mortality and felt
duration as three readings before any lifespan content. Eight lanes from
rounds 7-8 still writing.

**Neighbors from another session:** [companions, familiars and pets](../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md)
owns beings that travel with the player and points playing as one back here;
the [core foundations scorecard](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md)
rates body, anatomy and senses (U02) thin and names the body/control layer as
the top foundation blocker, owned by this engine lane.

**Dispatched:** [nonhuman cheats](NONHUMAN_CHEATS_2026-10-14.md),
[overarching frame](NONHUMAN_OVERARCHING_FRAME_2026-10-14.md) and
[implementation implications](NONHUMAN_IMPLEMENTATION_IMPLICATIONS_2026-10-14.md).

### Cheats that show these things (proposals)

| Code | Cheat | What it shows, and what it doesn't |
| --- | --- | --- |
| CV1 | **Body appraisal** | A body's functions, slots and intake as a status window row; hidden origins stay sealed and show as "unknown" |
| CV2 | **Soul sight** | Who is inside a body (a possessor, a reincarnator, an empty shell); can be fooled by wards or masks |
| CV3 | **Beast tongue** | Translates animal and monster signals into plain text, with honest gaps where the being has no words for something |
| CV4 | **Trail sight** | Scent and sound trails drawn over the location view (SB6), fading with time |
| CV5 | **Kin sight** | Shows family and brood links between beings, including ones they don't know about themselves |
| CV6 | **Evolution preview** | Shows the next branches a body can take and what each needs; a Great Sage style guide that can also advise |
| CV7 | **Bond meter** | Shows a partner's trust and terms as they stand (C3: separate from contract and law) |
| CV8 | **Instinct readout** | Names the pull a body feels and why (hunger for mana, migration urge) so the player can choose to follow it |
| CV9 | **Monster codex** | Fills in entries for beings met or eaten; facts are marked seen, told or guessed (unbiased lens) |
| CV10 | **Perception preview** | Lets a human see a room as a bat or a tree would, before choosing that body or to understand a companion |
| CV11 | **Lineage sight** | Shows bloodlines, sources and dormant traits in a body (GENETICS), not their sealed meaning |
| CV12 | **Disguise check** | Shows how a nonhuman's disguise currently reads to a given watcher |

**Cheats that grant or change bodies:** absorb-and-copy (Predator), a form
library, possession, second body, race change, naming power, taming, summon
contract, body repair, a return-to-human key. The cheat lane maps these to E
codes and the acquisition process.

**Subtle cheats:** always knowing the way home, animals that trust you,
never forgetting a scent, plants that lean toward you, a ghost's knack for
being overlooked.

### Overarching (proposals)

| Code | Consideration |
| --- | --- |
| OA1 | **One person, many bodies.** Keep person, soul, mind, body, controller and record as six separate things in every world; worlds decide which ones exist |
| OA2 | **Why the player can be anything.** Each lore model (O1-O8) or a Paradise contract gives a reason; a world without a reason can still allow it as a plain setting |
| OA3 | **A soul's long road.** An optional overarching arc: living as many kinds of being and carrying something small from each (a codex entry, a habit, a friend) |
| OA4 | **Mixed society as an endgame.** Founding a place where humans and nonhumans live under one law, as one optional long goal among many |
| OA5 | **Scope guard.** Nonhuman starts sit inside the first milestone's one realm and one prestige layer; they deepen it rather than add realms |
| OA6 | **One glossary.** About 25 lane docs now use overlapping code letters; a single pointer table keeps them findable (overarching lane) |

### Implementation implications (proposals)

| Code | Consideration |
| --- | --- |
| IM1 | **Body layer is foundation work.** Slice 1 (body record, function queries, migration) touches the same layers as the foundation adoption chain; it should be scheduled with that chain's owner, not around it |
| IM2 | **Human play must not change.** Every nonhuman step ships with a human regression slice and a legacy-save migration check |
| IM3 | **Write the missing tests first** (N25): reedling, Tern and the realm traveler have no dedicated tests today |
| IM4 | **Content is the real cost.** After Slice 1, each new body kind is mostly content (verbs, text, micro details, a first hour); body templates as data (OT11) keep that cost down |
| IM5 | **Status window is the cheap reveal surface.** Cheats CV1, CV7, CV8 and the Body view (SS2) can share one panel instead of each adding UI |
| IM6 | **Save size grows with bodies.** Brood, kin and multi-body play need caps and summarized members from the start (OT15, OS15) |
| IM7 | **Paradise mission bodies are a safe test bed.** A lent body that returns at extraction (N18, N30) exercises leases without risking the main body |

### Subtle stuff (proposals)

| Code | Consideration |
| --- | --- |
| SB13 | **Knowing too much.** A cheat that reads souls or kin can show the player things the body shouldn't act on yet; acting on it early can tip off NPCs |
| SB14 | **Cheats leave traces.** A beast tongue user may start making animal sounds; a soul-sight user flinches at empty bodies; others notice |
| SB15 | **Codex as a diary.** Codex entries written in the body's own voice (the hound records smells, the ghost records regrets) |
| SB16 | **Quiet carry.** One small thing from a past body (fear of water, a love of sunlight) shows up in the next life as a harmless habit |

## Round 10: comic worlds, abstractions, commits (2026-10-14)

Weibao: "Considering comic worlds and stuff and more? more to consider? ...
Abstaction thats needed? Merging, commiting or pushing?"

**Returned since round 9:** [kin and relationships](NONHUMAN_KIN_AND_RELATIONSHIPS_2026-10-14.md),
[nonhuman-majority worlds](NONHUMAN_MAJORITY_WORLDS_2026-10-14.md) and
[clocks](NONHUMAN_CLOCKS_LIFESPANS_AND_SEASONS_2026-10-14.md) are complete;
micro details, body authoring and minds have partial drafts.

**Parallel sessions answered this same request.** Comic worlds are owned by
[comic worlds and medium](../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md)
(with Codex lanes K1-K6, webtoon and manhwa included), the
[comics wiki pilot](../research/comics/REPORT.md),
[world core kit round 6](WORLD_CORE_KIT_2026-10-14.md#round-6-comic-worlds-cheats-that-show-the-kit-overarching-shape-abstractions-2026-10-14)
(AX1-AX19) and [intro flow round 22](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-22-comic-worlds-away-progress-abstractions-2026-10-14)
(AB1-AB9). I stopped this folder's duplicate comics and manhwa lanes before
they wrote anything. The CW rows below are only the nonhuman angle and use
local codes; the comic owner's CW codes are separate. The
[nonhuman abstractions](NONHUMAN_ABSTRACTIONS_NEEDED_2026-10-14.md) lane was
restarted to map onto AX and AB and add only nonhuman needs, with prefix NA.
Comics are consideration research, not a priority change.

### Comic worlds, nonhuman angle (proposals, local codes)

| Code | Consideration |
| --- | --- |
| CW1 | **Pin one continuity.** Comics reboot and branch; each world record names one continuity and era (Ultimate, a run, an event) the way book worlds pin an edition |
| CW2 | **Street level is life-sim.** Civilians, cleanup crews, reporters and shopkeepers in a hero city are the comic version of the background-extra start (SA11) |
| CW3 | **Secret identity as two records.** Public self and masked self with separate reputations, relationships and evidence trails (VS6 double life, SB8) |
| CW4 | **Legacy mantles.** A costume and name passed between people is a carrier with its own reputation (titles doc), a natural linked start |
| CW5 | **Events as world events.** Crossovers and invasions as cosmic events that change every location for a while (COSMIC_EVENTS) |
| CW6 | **Death and return as a dial.** Comic resurrection is common; a world dial sets how often and at what cost (C4, N39) |
| CW7 | **Comic nonhumans.** Symbiotes, Groot, Krypto, Lockjaw, Swamp Thing, the Endless, Hellboy's demons; plus whole animal worlds (Usagi, Mouse Guard) as OT1 nonhuman-majority worlds |
| CW8 | **Webtoon systems.** Tower of God floors, Solo Leveling gates and status windows map onto existing system-world and status window work; Eleceed's man-in-a-cat-body is a ready nonhuman premise |

### Nonhuman abstractions (proposals; the lane maps these to AX and AB and checks code)

| Code | Abstraction | Rule |
| --- | --- | --- |
| NA1 | Body template and instance | Extend `simulation.people.*.body`; don't add a second body store |
| NA2 | Function query (`can`, `explain`) | Extend `capabilities.js` and realm traveler `functions` rather than a new registry |
| NA3 | Seat, controller and control lease | Generalize the Tern swap; replaces `hero_id` reads step by step |
| NA4 | Carrier and transition record | One record for every body change, possession and crossing (U12, V06) |
| NA5 | Perception filter | One read view per body; UI and NPC knowledge both read it |
| NA6 | Slot provider | Body supplies slots; items declare fits |
| NA7 | Recovery policy | Defeat, rest and repair per form behind one call |
| NA8 | Body pack format | Body templates as data, admitted by structured packs |

Rule of thumb: abstract only when a second real consumer exists. The human
body plus one nonhuman start (the hound) is that second consumer for NA1-NA3
and NA6; perception, clocks and kin wait for their own second consumer.

### More angles (proposals)

| Code | Consideration |
| --- | --- |
| N43 | **Comic panels as presentation.** A comic-world UI skin (caption boxes, sound effects as text) through the presentation owner, like the Proto23 ink cue |
| N44 | **Power tiers vs street level.** Comic power scales from a bat-themed detective to cosmic beings; contextual power scaling (CAMPAIGN_FRAMEWORK) keeps both playable |
| N45 | **Cheats from comics.** Danger sense, mutant detection, power mimicry, symbiote bonding; the cheats lane covers the show-and-grant split (CV codes) |
| N46 | **Sidekick and pet hero.** Krypto, Lockjaw or a hero's familiar as a pet seat beside a hero (N17), reusing the bonds lane |

### Commits

Standing rule: commit only this task's paths and keep other sessions' edits
out. Lane logs stay uncommitted because Codex echoes file contents from the
private novels folder into them.

## Round 11: fold of the last ten lanes; wave folded (2026-10-14)

Approved fold (relayed from the coordinating session as Weibao's O2): fold
finished lane returns, no new lanes, everything stays proposals. The
[nonhuman-starts-2026-10-14](../gm/dispatch/nonhuman-starts-2026-10-14/runs/SESSIONS.md)
wave had 26 runs: 23 completed, and three stopped before any output (comics and
manhwa as duplicates of the comic owner, and the first abstraction run, which
was relaunched as abstraction2). This round folds the ten not yet
folded. **The wave is folded.**

### What each lane adds

| Lane | Adds | Top pick |
| --- | --- | --- |
| [Synthesis and roadmap](NONHUMAN_SYNTHESIS_AND_ROADMAP_2026-10-14.md) | One-page answer; dependency graph; a 25-row ordered slice roadmap with one gate G0 for every row (rebuild, fresh origin at 1366x768, save/reload/export/literal import); a crosswalk placing every lane's "first" pick; conflicts CF1-CF24; duplicates DU1-DU18 with canonical pointers; gaps G1-G10 | Slice 1 foundation, then Slice 2 Village hound |
| [Start specs](NONHUMAN_START_SPECS_2026-10-14.md) | Build-ready records and first-hour scripts: SS-A Village hound, SS-B HP free house-elf worker, SS-C Paradise alchemical bird partner beside an original contractor; shared contract SS0; acceptance checklist SS-AC | SS-A |
| [Minds and cognition](NONHUMAN_MINDS_AND_COGNITION_2026-10-14.md) | Knowledge modes, instinct vs reason vs compulsion, faceless emotion, language and numbers, memory and time sense, theory of mind; beats MN-S1-S32, MN1-MN18 | MN-P1: two knowledge presets (human memory vs native) in one hound encounter |
| [Making and building](NONHUMAN_MAKING_AND_BUILDING_2026-10-14.md) | Routes MK1-MK15 (silk, resin, digging, nests, grown structures, breath forging, core rooms), recipe methods and slots, earned manipulators, homes as facilities, buyers; MK-S1-S16 | MK-A1: the hound arranges real lining into a fitted rest spot |
| [Micro details](NONHUMAN_SUBTLE_MICRO_DETAILS_2026-10-14.md) | 8+ details per body kind; cross-species signals, body states, scraps economy, habits into skills, micro ecology; noise rules MD-N1-N10 | MD-P1: two comfort/rest lines for one admitted body |
| [Body authoring](NONHUMAN_BODY_AUTHORING_2026-10-14.md) | Template/instance data format with worked hound, sapling, blade and an enemy-to-template example; checklist BA-C1-C12; lint rules; fixture set; procedural species grammar; per-world packs | BA-S1/BA-S2: template/instance split plus human, reedling, Tern and hound fixtures |
| [Cheats](NONHUMAN_CHEATS_2026-10-14.md) | Show cheats CN-S, grant/change cheats CN-G, starting cheats CN-A, combinations and per-world limits CN-I, quiet knacks CN-SB, state and desktop layout CN-E | CN-P1: body self-reader plus one scent result on the hound |
| [Overarching frame](NONHUMAN_OVERARCHING_FRAME_2026-10-14.md) | Identity across bodies and worlds (OA1/OA2 extended), continuity dispositions, optional long arcs, life-sim fit, a code-routing glossary | S1: apply OA1's six distinctions to the selected slice |
| [Implementation implications](NONHUMAN_IMPLEMENTATION_IMPLICATIONS_2026-10-14.md) | Blast radius per system, sequencing IM-D1-D9 against live owners, save and rollback, verification matrix IM-V, many-body caps, content cost, risks, a minimum viable path IM-A1-A5 | IM-A1-A5: baseline fixtures, preserve existing lives, prove Slice 1, add one hound, playable acceptance |
| [Abstractions needed](NONHUMAN_ABSTRACTIONS_NEEDED_2026-10-14.md) | Inventory of existing code abstractions; nonhuman additions mapped to AX1-AX19 and intro AB1-AB9; bridge plan for native Hero vs simulation people; layering save to UI; second-consumer threshold | NA-S1/NA-S2: lock vocabulary, then a narrow body read/function bridge |

### Agreement: one first path

Every lane above converges on the same path, which matches C1 and C12:
**Slice 1** (one body record, function queries, migration, proved on human,
reedling and Tern, with the missing tests written first), then **Slice 2**, the
original Village hound (scent errand, guard signal, collar fit, safe routine,
bite and recovery, two knowledge presets, two comfort lines, a self-reader
cheat and a nest-lining action), then **Slice 3**, hound plus caretaker. The
synthesis keeps the many extras optional so the first taste stays small
(CF23). Proposal; implementation still needs its own authorization and
scheduling with the foundation owner (IM1, IM-D6).

### Corrections and contradictions this round settles

| Code | What changes in this owner | Source |
| --- | --- | --- |
| K1 | **First-slice shortlist superseded.** Round 5's order (hound, house-elf, Paradise pet, blade, aranea or slime) is replaced by the synthesis roadmap: Slices 4-6 put HP house-elf, D&D blade and MoL aranea first among canon worlds (D&D before MoL follows standing priority), and Paradise runs hub return (7), then household creature (8), then pet seat (9) | CF7, CF8 |
| K2 | **Some form checks are real rules.** E2 and B8 said to replace `form === 'human'` checks. Several are authored world admission or material rules and stay; only anatomy shortcuts are replaced | CF4 |
| K3 | **F1, B1, B7 and B11 corrected.** The engine spec corrects this owner's source summaries (age read, single-combatant framing, heirs-are-human); use its entries | CF6 |
| K4 | **One body store now, a registry later.** E1's single body per person holds until a second-body slice; then an explicit registry migration | CF5 |
| K5 | **Bond doesn't lend hands.** N5's "bond as a stat" is refined: regard changes what a partner offers to do; the partner still does the work with its own means | CF9, DU4 |
| K6 | **Knowledge belongs to the knower.** E9's "skills keep XP on the controller" is refined: knowledge sits with the actual person, mind or source; motor practice with the body | CF13, DU6 |
| K7 | **Round 10 NA codes.** The abstraction lane's NA table supersedes round 10's illustrative NA1-NA8 list | Abstractions lane |
| K8 | **Cadence.** Micro owns texture timing; the hound spec's tighter cadence is a local override (CF21) | CF21 |

Other conflicts (CF10-CF20, CF22, CF24) keep the synthesis lane's resolutions. None requires Weibao unless a slice would add
irreversible offscreen loss, forced instinct actions, hunger death or a new
prestige layer, or move an original beast catalog ahead of canon-first work
(IM-Q1, IM-Q2).

### Duplicates

Use the synthesis duplicates register (DU1-DU18) as the canonical pointer
table. Examples: perception goes to SU1, ownership to SL2, support to BS5,
defeat and repair to E6, knowledge to PG1, staying nonhuman to N15.

### Open gaps no lane closed

The synthesis gaps G1-G10, with the most important being G5 (no running body
compiler or pack migration), G8 (no executed browser and save matrix for body
starts) and G10 (no selected integration packet with reserved files). These
are where implementation planning starts; they are not new research lanes.

### Status

Wave folded 2026-10-14. All outputs are proposals. No code, build, test or
browser verification was run by this wave.
